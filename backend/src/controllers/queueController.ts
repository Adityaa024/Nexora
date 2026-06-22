import { Request, Response } from 'express';
import Token from '../models/Token';
import { triageSymptoms } from '../services/geminiService';
import { emitQueueStateUpdate, emitCriticalAlarm } from '../services/socketService';

const generateTokenNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000);
  return `T-${dateStr}-${randomNum}`;
};

export const bookToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, symptomsRaw } = req.body;

    // AI Triage
    let priorityScore = 3;
    let riskLevel = 'LOW';
    let aiRationale = '';

    if (symptomsRaw) {
      const triageResult = await triageSymptoms(symptomsRaw);
      priorityScore = triageResult.priorityScore;
      riskLevel = triageResult.riskLevel;
      aiRationale = triageResult.aiRationale;
    }

    const tokenNumber = generateTokenNumber();

    const newToken = new Token({
      tokenNumber,
      patientId,
      symptomsRaw,
      priorityScore,
      riskLevel,
      aiRationale,
      status: 'BOOKED'
    });

    await newToken.save();
    
    // Broadcast if necessary
    emitQueueStateUpdate();

    res.status(201).json(newToken);
  } catch (error) {
    console.error('Error booking token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const scanArrival = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenId, tokenNumber } = req.body;

    const query = tokenId ? { _id: tokenId } : { tokenNumber };

    const result = await Token.findOneAndUpdate(
      { ...query, status: 'BOOKED' },
      { $set: { status: 'ARRIVED', checkInTime: new Date() } },
      { new: true }
    ).populate('patientId', 'name age gender');

    if (!result) {
      res.status(400).json({ message: 'Invalid token or token already arrived' });
      return;
    }

    if (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') {
      emitCriticalAlarm(result);
    }

    emitQueueStateUpdate();

    res.json(result);
  } catch (error) {
    console.error('Error in scanArrival:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changeState = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenId, newState } = req.body;
    
    // Concurrency Safeguard & Atomic State Protection
    const currentToken = await Token.findById(tokenId);
    if (!currentToken) {
      res.status(404).json({ message: 'Token not found' });
      return;
    }

    const updateQuery: any = { $set: { status: newState } };

    if (newState === 'IN_CONSULTATION' && currentToken.status === 'WAITING') {
      updateQuery.$set.consultationStartTime = new Date();
    } else if (newState === 'COMPLETED' && currentToken.status === 'IN_CONSULTATION') {
      updateQuery.$set.consultationEndTime = new Date();
      if (currentToken.consultationStartTime) {
        updateQuery.$set.actualDurationMinutes = 
          (new Date().getTime() - currentToken.consultationStartTime.getTime()) / 60000;
      }
    }

    const result = await Token.findOneAndUpdate(
      { _id: tokenId, status: currentToken.status }, // atomic check
      updateQuery,
      { new: true }
    );

    if (!result) {
      res.status(409).json({ message: 'Race condition occurred: Token already claimed or modified.' });
      return;
    }

    emitQueueStateUpdate();

    res.json(result);
  } catch (error) {
    console.error('Error changing state:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getActiveQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const activeTokens = await Token.find({
      status: { $in: ['BOOKED', 'ARRIVED', 'WAITING', 'IN_CONSULTATION'] }
    }).populate('patientId', 'name age gender').sort({ priorityScore: -1, checkInTime: 1 });
    
    res.json(activeTokens);
  } catch (error) {
    console.error('Error fetching active queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const allTokens = await Token.find().populate('patientId', 'name age gender').sort({ createdAt: -1 });
    res.json(allTokens);
  } catch (error) {
    console.error('Error fetching all queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatientHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const history = await Token.find({ patientId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
