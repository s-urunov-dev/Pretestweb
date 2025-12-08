import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { testResultService, TestResultDetail } from '../services/test-result.service';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, FileText, Download, Trophy, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Snowfall } from '../components/Snowfall';

export function TestResultDetailPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [result, setResult] = useState<TestResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) {
        setError('Result ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await testResultService.getTestResultDetail(resultId);
        setResult(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching test result:', err);
        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Failed to load test result');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 5.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 7) return 'bg-green-50 border-green-200';
    if (score >= 5.5) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Snowfall />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#182966] mx-auto mb-4"></div>
          <p className="text-[#182966]/70">Loading test result...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <Snowfall />
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mb-2 text-[#182966]">Test Result Not Found</h2>
            <p className="text-[#182966]/70">
              {error || 'The test result you are looking for does not exist or you do not have permission to view it.'}
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="bg-[#182966] hover:bg-[#182966]/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Snowfall />
      
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-[#182966]/20 text-[#182966] hover:bg-[#182966]/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-[#182966]" />
            <h1 className="text-[#182966]">Test Result Details</h1>
          </div>
          <p className="text-[#182966]/70">Result ID: {result.id}</p>
        </motion.div>

        {/* Overall Score - Big Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`p-8 text-center border-2 ${getScoreBgColor(result.overall)}`}>
            <div className="mb-4">
              <Target className="h-12 w-12 mx-auto text-[#182966] mb-2" />
              <p className="text-[#182966]/70 uppercase tracking-wide text-sm">Overall Band Score</p>
            </div>
            <div className={`text-7xl mb-2 ${getScoreColor(result.overall)}`}>
              {result.overall}
            </div>
            <p className="text-[#182966]/60">{result.test_type.name}</p>
          </Card>
        </motion.div>

        {/* Individual Scores Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Reading', score: result.reading, icon: '📖' },
            { label: 'Listening', score: result.listening, icon: '🎧' },
            { label: 'Writing', score: result.writing, icon: '✍️' },
            { label: 'Speaking', score: result.speaking, icon: '🗣️' },
          ].map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className={`p-6 text-center border ${getScoreBgColor(skill.score)}`}>
                <div className="text-3xl mb-2">{skill.icon}</div>
                <p className="text-[#182966]/70 text-sm mb-2">{skill.label}</p>
                <div className={`text-3xl ${getScoreColor(skill.score)}`}>
                  {skill.score}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Test Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Session Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="p-6">
              <h3 className="mb-4 text-[#182966] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Session Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#182966]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#182966]/60">Date</p>
                    <p className="text-[#182966]">
                      {new Date(result.session.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#182966]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#182966]/60">Time</p>
                    <p className="text-[#182966]">{result.session.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#182966]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#182966]/60">Location</p>
                    <p className="text-[#182966]">{result.session.location}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* User Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="p-6">
              <h3 className="mb-4 text-[#182966] flex items-center gap-2">
                <User className="h-5 w-5" />
                Test Taker Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#182966]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#182966]/60">Full Name</p>
                    <p className="text-[#182966]">{result.user.full_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#182966]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#182966]/60">Phone Number</p>
                    <p className="text-[#182966]">{result.user.phone_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[#182966]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#182966]/60">Result Date</p>
                    <p className="text-[#182966]">
                      {new Date(result.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* PDF Download */}
        {result.pdf_file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#182966]/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-[#182966]" />
                  </div>
                  <div>
                    <h3 className="text-[#182966]">Official Test Report</h3>
                    <p className="text-sm text-[#182966]/60">Download your detailed test result PDF</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(result.pdf_file!, '_blank')}
                  className="bg-[#182966] hover:bg-[#182966]/90"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
