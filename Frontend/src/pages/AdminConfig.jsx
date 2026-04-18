import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { ArrowLeft, Save, Settings, Calendar, UserPlus, Clock, LayoutDashboard } from 'lucide-react';

export default function AdminConfig() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [config, setConfig] = useState({
    electionStatus: 'registration',
    startTime: '',
    endTime: '',
    candidateRegStart: '',
    candidateRegEnd: '',
  });

  useEffect(() => {
    axiosClient.get('/api/config')
      .then((r) => {
        if (r.data?.config) {
          const c = r.data.config;
          setConfig({
            electionStatus: c.electionStatus || 'registration',
            startTime: c.startTime ? new Date(c.startTime).toISOString().slice(0, 16) : '',
            endTime: c.endTime ? new Date(c.endTime).toISOString().slice(0, 16) : '',
            candidateRegStart: c.candidateRegStart ? new Date(c.candidateRegStart).toISOString().slice(0, 16) : '',
            candidateRegEnd: c.candidateRegEnd ? new Date(c.candidateRegEnd).toISOString().slice(0, 16) : '',
          });
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put('/api/config', config);
      alert('Configuration updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-semibold tracking-tight">Admin Console</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10 z-10">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Election Dashboard</h1>
              <p className="text-slate-400 mt-1 text-sm">Configure system parameters and manage registration.</p>
            </div>
            <button
              onClick={() => navigate('/candidate-registration')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Register Candidate
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Election Control Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold">General Status</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">System Election Status</label>
                  <select
                    name="electionStatus"
                    value={config.electionStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="registration">Registration Mode</option>
                    <option value="waiting">Waiting Period</option>
                    <option value="voting">Election in Progress</option>
                    <option value="ended">Election Concluded</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 w-full">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Current Visibility</p>
                    <p className="text-sm text-emerald-400 font-medium italic">Voter registration is always open</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Voting Window */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold">Voting Window</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Voting Start Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={config.startTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Voting End Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={config.endTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Registration Section */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold">Candidate Period</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Registration Start</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="datetime-local"
                        name="candidateRegStart"
                        value={config.candidateRegStart}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Registration End</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="datetime-local"
                        name="candidateRegEnd"
                        value={config.candidateRegEnd}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/30 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Propagating Changes...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
