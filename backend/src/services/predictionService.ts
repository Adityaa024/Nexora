import Token from '../models/Token';
import User from '../models/User';

export const calculateMovingAverage = async (): Promise<number> => {
  // Get last 5 completed consultations
  const lastCompleted = await Token.find({ status: 'COMPLETED', actualDurationMinutes: { $exists: true } })
    .sort({ consultationEndTime: -1 })
    .limit(5);

  if (lastCompleted.length === 0) {
    return 10; // Default 10 minutes if no data
  }

  const totalDuration = lastCompleted.reduce((sum, token) => sum + (token.actualDurationMinutes || 0), 0);
  return totalDuration / lastCompleted.length;
};

export const getActiveDoctorsCount = async (): Promise<number> => {
  // Simplified active doctors: doctors with status DOCTOR that are currently in the system
  // In a real system, you might have an "isOnline" flag. Let's assume a default of 1 if none found for demo purposes
  const doctors = await User.countDocuments({ role: 'DOCTOR' });
  return doctors > 0 ? doctors : 1; 
};

export const computeQueueWithEstimations = async () => {
  const activeTokens = await Token.find({
    status: { $in: ['BOOKED', 'ARRIVED', 'WAITING', 'IN_CONSULTATION'] }
  }).populate('patientId', 'name age gender').sort({ priorityScore: -1, checkInTime: 1 }).lean();

  const mu_c = await calculateMovingAverage();
  const activeDoctors = await getActiveDoctorsCount();

  let tokensAhead = 0;
  
  const enrichedTokens = activeTokens.map(token => {
    let estimatedWaitTime = 0;
    
    if (token.status === 'WAITING' || token.status === 'ARRIVED') {
      estimatedWaitTime = (tokensAhead * mu_c) / activeDoctors;
      tokensAhead++;
    }

    return {
      ...token,
      estimatedWaitTimeMinutes: Math.round(estimatedWaitTime)
    };
  });

  return enrichedTokens;
};
