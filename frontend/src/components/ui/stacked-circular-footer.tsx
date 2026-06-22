import { Activity } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function StackedCircularFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-2xl bg-emerald-700 p-4 shadow-lg shadow-emerald-700/20">
            <Activity className="w-8 h-8 text-white" />
          </div>
          
          <nav className="mb-10 flex flex-wrap justify-center gap-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-emerald-700 transition-colors">Platform</a>
            <a href="#" className="hover:text-emerald-700 transition-colors">Solutions</a>
            <a href="#" className="hover:text-emerald-700 transition-colors">Pricing</a>
            <a href="#" className="hover:text-emerald-700 transition-colors">Resources</a>
            <a href="#" className="hover:text-emerald-700 transition-colors">Contact</a>
          </nav>

          <div className="mb-12 w-full max-w-md bg-slate-50 p-2 rounded-full border border-slate-200">
            <form className="flex">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input 
                  id="email" 
                  placeholder="Enter your email to subscribe..." 
                  type="email" 
                  className="rounded-l-full border-none bg-transparent shadow-none focus-visible:ring-0 px-6" 
                />
              </div>
              <Button type="submit" className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-8">Subscribe</Button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">
              © 2026 NEXORA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }
