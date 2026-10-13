import { BriefcaseBusiness, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 text-2xl font-bold text-white"><span className="text-emerald-400">Campus</span>Connect</div>
          <p className="text-sm text-slate-300">A modern student-first portal for seamless admission, academic services, and support.</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/admissions">Admissions</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Admissions</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Eligibility</li>
            <li>Documents</li>
            <li>Application Process</li>
            <li>Scholarships</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><Mail size={16} /> hello@campusconnect.edu</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> 24 Knowledge Avenue, Pune</li>
          </ul>
          <div className="mt-4 flex gap-3 text-slate-300">
            <Globe size={16} />
            <BriefcaseBusiness size={16} />
            <Mail size={16} />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">© 2026 CampusConnect. All rights reserved.</div>
    </footer>
  )
}
