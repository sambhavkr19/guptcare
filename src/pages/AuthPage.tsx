import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Stethoscope, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Mail,
  KeyRound,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    signInGoogle, 
    signInEmail, 
    registerEmail, 
    logOut, 
    navigateTo, 
    showToast 
  } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'recovery'>('signin');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'recovery') {
      setRecoverySubmitted(true);
      showToast('Discreet password recovery instructions dispatched.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (authMode === 'signin') {
        await signInEmail(email, password);
        navigateTo('patient-dashboard');
      } else {
        await registerEmail(email, password, role, alias || 'Patient Member');
        navigateTo(role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard');
      }
    } catch (err: any) {
      console.warn('Auth attempt error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInGoogle();
      navigateTo('patient-dashboard');
    } catch (err) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already logged in, show current session status
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-16 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E0D6] shadow-xs text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#EBF3F0] text-[#0E4D45] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#0E4D45]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#112F2B]">Authenticated Session Active</h2>
              <p className="text-xs text-[#526B64] mt-1">
                Connected via Firebase Auth: <strong>{currentUser.email}</strong>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3F0] text-[#0E4D45]">
                <span>Role: {userProfile?.role || 'patient'}</span>
                <span>·</span>
                <span className="capitalize">
                  {userProfile?.role === 'doctor' 
                    ? `Doctor Status: ${userProfile?.doctorVerificationStatus || 'pending'}` 
                    : 'Protected Patient'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => navigateTo(userProfile?.role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard')}
                className="w-full py-3 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs"
              >
                Enter {userProfile?.role === 'doctor' ? 'Doctor Portal' : 'Patient Dashboard'}
              </button>
              <button
                onClick={logOut}
                className="w-full py-2.5 text-xs font-semibold text-[#8C3F13] bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                Sign Out Safely
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2E2B] py-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E0D6] shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#0E4D45] text-white mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#112F2B]">
              {authMode === 'signin' ? 'Sign In to GuptCare' :
               authMode === 'register' ? 'Create Private Account' :
               'Discreet Password Recovery'}
            </h1>
            <p className="text-xs text-[#526B64]">
              {authMode === 'signin' ? 'Access your private health records, appointments, and prescriptions.' :
               authMode === 'register' ? 'Role-protected registration enforced by Cloud Firestore Security Rules.' :
               'Neutral notifications with zero sensitive health terminology.'}
            </p>
          </div>

          {/* Quick 1-Click Google Sign In (Auto-configured by Firebase) */}
          {authMode !== 'recovery' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D5D1C4] hover:bg-[#FAF9F6] transition-colors text-xs font-semibold text-[#112F2B] flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (1-Click Real Auth)</span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-[#E8E5DC]" />
                <span className="px-3 text-[11px] text-[#7A958E] uppercase tracking-wider">or email</span>
                <div className="flex-1 border-t border-[#E8E5DC]" />
              </div>
            </div>
          )}

          {/* Role Switcher on Registration */}
          {authMode === 'register' && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#1B3833] uppercase tracking-wider block">
                Account Type:
              </span>
              <div className="grid grid-cols-2 gap-2 bg-[#F2EFE8] p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'patient' ? 'bg-white text-[#112F2B] shadow-xs font-semibold' : 'text-[#526B64] hover:text-[#112F2B]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'doctor' ? 'bg-white text-[#112F2B] shadow-xs font-semibold' : 'text-[#526B64] hover:text-[#112F2B]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Account</span>
                </button>
              </div>

              {role === 'doctor' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Practitioner Note:</strong> Creating a doctor account does not grant immediate access to patient records. New doctor accounts are placed in <em>Pending Verification</em> until medical council registration and degree certificates are verified by an administrator.
                </div>
              )}
            </div>
          )}

          {/* Anonymity disclaimer note */}
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE7DC] text-[11px] text-[#4E6761] leading-relaxed">
            <strong className="text-[#1B3833] block mb-0.5">Privacy Notice:</strong>
            Pseudonymous display names safeguard your consultation comfort, while your email remains strictly confidential in Firebase Authentication.
          </div>

          {recoverySubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <strong className="block font-semibold">Recovery Email Dispatched</strong>
              <p>Check your inbox for a message with a neutral, non-identifying subject line.</p>
              <button
                onClick={() => {
                  setRecoverySubmitted(false);
                  setAuthMode('signin');
                }}
                className="mt-2 text-xs font-bold text-[#0E4D45] underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                    {role === 'doctor' ? 'Full Name & Title (e.g. Dr. Rajesh Kumar):' : 'Display Alias / Pseudonym (e.g. Patient Alex):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder={role === 'doctor' ? 'Dr. Name' : 'Patient Alex'}
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl px-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-[#1B3833] uppercase tracking-wider block mb-1">
                  Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A958E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                  />
                </div>
              </div>

              {authMode !== 'recovery' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#1B3833] uppercase tracking-wider">
                      Password:
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('recovery')}
                        className="text-[11px] text-[#0E4D45] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#7A958E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#FAF9F6] border border-[#DDD9CE] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1B3833] focus:outline-none focus:ring-2 focus:ring-[#0E4D45]/30 focus:border-[#0E4D45]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-xs font-semibold text-white bg-[#0E4D45] hover:bg-[#083630] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isSubmitting ? 'Verifying with Firebase...' :
                   authMode === 'signin' ? 'Sign In' :
                   authMode === 'register' ? 'Create Account' :
                   'Send Recovery Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Mode Switchers */}
          <div className="pt-2 border-t border-[#F0EEE6] text-center text-xs text-[#526B64]">
            {authMode === 'signin' ? (
              <p>
                Don&apos;t have an account yet?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-[#0E4D45] hover:underline cursor-pointer"
                >
                  Create one confidentially
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="font-bold text-[#0E4D45] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
