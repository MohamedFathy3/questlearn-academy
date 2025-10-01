import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { apiFetch } from '@/lib/api';

import {
  Clock,
  FileText,
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  Brain,
  Target,
  BarChart3,
  Shield,
  RotateCcw
} from "lucide-react";

interface Choice {
  id: number;
  choice_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_text: string;
  choices: Choice[];
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions_count: number;
  total_marks: number;
  passing_marks: number;
  available_from: string;
  available_to: string;
  status: string;
  questions: Question[];
}

interface Answer {
  question_id: number;
  choice_id: number;
}

interface SubmitResponse {
  result: string;
  message: {
    score: number;
    total_marks: number;
    passed: boolean;
    correct_answers: number;
    total_questions: number;
    percentage: number;
  };
  status: number;
}

const ExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      fetchExam();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Fetching exam with ID:", id);
      
      const token = Cookies.get("token");
      if (!token) {
        toast({
          title: "Login Required",
          description: "Please login to take the exam",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // الطريقة الأولى: البحث في بيانات المستخدم من localStorage
      console.log("🔍 Searching in localStorage user data...");
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log("👤 User data:", user);
          
          // البحث في جميع كورسات المستخدم عن الامتحان المطلوب
          let foundExam = null;
          if (user.courses && Array.isArray(user.courses)) {
            for (const course of user.courses) {
              console.log("📚 Checking course:", course.id, course.title);
              if (course.exams && Array.isArray(course.exams)) {
                console.log("📝 Course exams:", course.exams);
                const examFromCourse = course.exams.find((e: any) => e.id && e.id.toString() === id);
                if (examFromCourse) {
                  foundExam = examFromCourse;
                  console.log("✅ Exam found in course:", foundExam);
                  break;
                }
              }
            }
          }
          
          if (foundExam) {
            validateAndSetExam(foundExam);
            return;
          }
        } catch (userError) {
          console.error("❌ Error parsing user data:", userError);
        }
      }

      // الطريقة الثانية: استخدام الـ API المباشر
      console.log("🌐 Trying direct API call...");
      try {
        const response = await apiFetch<any>(`/exams/${id}`, {
          method: 'GET'
        });

        console.log("📡 Exam API Response:", response);

        if (response.result === "Success" && response.data) {
          // إذا كان response.data هو كائن Exam صالح
          if (typeof response.data === 'object' && response.data.questions) {
            validateAndSetExam(response.data);
            return;
          }
          // إذا كان response.data هو سلسلة نصية، نبحث في message
          else if (response.message && typeof response.message === 'object') {
            validateAndSetExam(response.message);
            return;
          }
        }
      } catch (apiError) {
        console.log("⚠️ API call failed:", apiError);
      }

      // الطريقة الثالثة: استخدام fetch مباشرة
      console.log("🔧 Trying direct fetch...");
      try {
        const response = await fetch(`/api/exams/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("📡 Direct fetch response:", data);
          
          if (data.result === "Success") {
            if (data.data && typeof data.data === 'object') {
              validateAndSetExam(data.data);
              return;
            } else if (data.message && typeof data.message === 'object') {
              validateAndSetExam(data.message);
              return;
            }
          }
        }
      } catch (fetchError) {
        console.log("⚠️ Direct fetch failed:", fetchError);
      }

      throw new Error("Exam not found in your courses or API");
    } catch (err: any) {
      console.error('🚨 Error fetching exam:', err);
      setError(err.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  // دالة للتحقق من صحة بيانات الامتحان وتعيينها
  const validateAndSetExam = (examData: any) => {
    console.log("🔍 Validating exam data:", examData);
    
    // إذا كان examData سلسلة نصية (مثل "Exam fetched successfully")، نتجاهلها
    if (typeof examData === 'string') {
      console.log("❌ Exam data is string, ignoring:", examData);
      throw new Error("Invalid exam data received");
    }

    // التحقق من الهيكل الأساسي للامتحان
    if (!examData.id || !examData.title) {
      console.log("❌ Invalid exam structure:", examData);
      throw new Error("Invalid exam structure");
    }

    // بناء كائن Exam صالح
    const validatedExam: Exam = {
      id: examData.id,
      title: examData.title || "Untitled Exam",
      description: examData.description || "No description available",
      duration: examData.duration || 60,
      questions_count: examData.questions_count || 0,
      total_marks: examData.total_marks || 100,
      passing_marks: examData.passing_marks || 50,
      available_from: examData.available_from || "",
      available_to: examData.available_to || "",
      status: examData.status || "active",
      questions: []
    };

    // معالجة الأسئلة
    if (examData.questions && Array.isArray(examData.questions)) {
      validatedExam.questions = examData.questions.filter((q: any) => 
        q && q.id && q.question_text && Array.isArray(q.choices)
      ).map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        choices: (q.choices || q.options || []).filter((c: any) => 
          c && c.id && c.choice_text !== undefined
        ).map((c: any) => ({
          id: c.id,
          choice_text: c.choice_text || "",
          is_correct: c.is_correct || false
        }))
      }));
    }

    console.log("✅ Final validated exam:", validatedExam);
    
    if (validatedExam.questions.length === 0) {
      console.log("❌ No valid questions found");
      throw new Error("No valid questions found in this exam");
    }

    setExam(validatedExam);
    setTimeLeft(validatedExam.duration * 60);
  };

  const startExam = () => {
    if (!exam || exam.questions.length === 0) {
      toast({
        title: "No Questions Available",
        description: "This exam doesn't have any questions yet.",
        variant: "destructive",
      });
      return;
    }

    setExamStarted(true);
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSelect = (questionId: number, choiceId: number) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.question_id === questionId);
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { question_id: questionId, choice_id: choiceId };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, { question_id: questionId, choice_id: choiceId }];
      }
    });
  };

  const getCurrentAnswer = (questionId: number): number | null => {
    const answer = answers.find(a => a.question_id === questionId);
    return answer ? answer.choice_id : null;
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAutoSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    toast({
      title: "Time's Up!",
      description: "Your exam has been automatically submitted.",
      variant: "default",
    });
    
    await submitExam();
  };

const submitExam = async () => {
  try {
    setSubmitting(true);
    
    console.log("📤 Submitting exam answers:", answers);
    
    const response = await apiFetch<any>(`/exams/${id}/submit`, {
      method: "POST",
      body: {
        answers: answers
      }
    });

    console.log("✅ Exam submission response:", response);

    if (response.result === "Success") {
      // فهم النتيجة بشكل صحيح - إذا كان score هو عدد الأسئلة الصحيحة
      const rawScore = response.message?.score || 0;
      const totalQuestions = exam?.questions_count || exam?.questions.length || 0;
      const totalMarks = exam?.total_marks || 100;
      const passingMarks = exam?.passing_marks || 50;
      
      // نفترض أن score هو عدد الأسئلة الصحيحة، ونحسب النسبة بناءً على ذلك
      const correctAnswers = rawScore;
      const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // النتيجة الفعلية (نحول عدد الأسئلة الصحيحة إلى درجة من total_marks)
      const actualScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * totalMarks) : 0;
      const passed = actualScore >= passingMarks;

      const resultData = {
        score: actualScore, // الدرجة الفعلية من total_marks
        total_marks: totalMarks,
        passed: passed,
        correct_answers: correctAnswers, // عدد الأسئلة الصحيحة
        total_questions: totalQuestions, // إجمالي عدد الأسئلة
        percentage: scorePercentage // النسبة المئوية للأسئلة الصحيحة
      };

      console.log("📊 Processed results:", resultData);
      console.log("🔍 Raw score from server:", rawScore);
      console.log("📝 Interpretation: ", correctAnswers, "correct answers out of", totalQuestions);
      
      setResults(resultData);
      setExamFinished(true);
      
      if (passed) {
        toast({
          title: "🎉 Congratulations!",
          description: `You passed the exam! ${correctAnswers}/${totalQuestions} correct answers (${scorePercentage}%)`,
          variant: "default",
        });
      } else {
        toast({
          title: "📚 Keep Learning!",
          description: `You got ${correctAnswers}/${totalQuestions} correct (${scorePercentage}%). You need ${passingMarks}/${totalMarks} to pass.`,
          variant: "destructive",
        });
      }
    } else {
      throw new Error(response.message || "Failed to submit exam");
    }
  } catch (error: any) {
    console.error("❌ Exam submission error:", error);
    toast({
      title: "Submission Failed",
      description: error.message || "Failed to submit exam. Please try again.",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!exam || !exam.questions) return 0;
    return (answers.length / exam.questions.length) * 100;
  };

  const getQuestionStatus = (index: number) => {
    if (!exam || !exam.questions || !exam.questions[index]) return "unanswered";
    const questionId = exam.questions[index]?.id;
    if (!questionId) return "unanswered";
    return getCurrentAnswer(questionId) ? "answered" : "unanswered";
  };

  // الحصول على السؤال الحالي بشكل آمن
  const getCurrentQuestion = () => {
    if (!exam || !exam.questions || !exam.questions[currentQuestionIndex]) {
      return null;
    }
    return exam.questions[currentQuestionIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Exam</h2>
            <p className="text-muted-foreground mb-4">{error || "Exam not found"}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Please make sure you are enrolled in the course that contains this exam.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchExam}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

{if (examFinished && results) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                results.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {results.passed ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {results.passed ? "Congratulations! 🎉" : "Keep Learning! 📚"}
              </h1>
              <p className="text-muted-foreground text-lg">
                {results.passed 
                  ? `You passed with ${results.correct_answers}/${results.total_questions} correct answers!` 
                  : `You got ${results.correct_answers}/${results.total_questions} correct. Keep practicing!`}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{results.correct_answers}/{results.total_questions}</div>
                  <div className="text-sm text-blue-600">Correct Answers</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{results.score}/{results.total_marks}</div>
                  <div className="text-sm text-green-600">Score</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{results.percentage}%</div>
                  <div className="text-sm text-purple-600">Percentage</div>
                </CardContent>
              </Card>
              
              <Card className={`${results.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-4 text-center">
                  <Shield className={`w-8 h-8 mx-auto mb-2 ${
                    results.passed ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div className={`text-2xl font-bold ${
                    results.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.passed ? 'PASSED' : 'FAILED'}
                  </div>
                  <div className={`text-sm ${
                    results.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Status
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-muted-foreground">
                  <strong>Passing requirement:</strong> {exam.passing_marks} out of {exam.total_marks} marks
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Each question is worth {Math.round(exam.total_marks / exam.questions_count)} marks
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/profile')}>
                  Back to Profile
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}}
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">{exam.title}</CardTitle>
              <p className="text-muted-foreground text-lg mt-2">{exam.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Timer className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">{exam.duration} min</div>
                    <div className="text-sm text-blue-600">Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">{exam.questions_count} Questions</div>
                    <div className="text-sm text-green-600">Total</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold text-purple-900">{exam.passing_marks}/{exam.total_marks}</div>
                    <div className="text-sm text-purple-600">Passing Score</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-900">
                      {Math.round((exam.passing_marks / exam.total_marks) * 100)}%
                    </div>
                    <div className="text-sm text-orange-600">Required</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions</h4>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• The exam will automatically submit when time runs out</li>
                      <li>• You cannot pause the exam once started</li>
                      <li>• Make sure you have a stable internet connection</li>
                      <li>• Read each question carefully before answering</li>
                      <li>• You can navigate between questions using next/previous buttons</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                  onClick={startExam}
                  disabled={!exam.questions || exam.questions.length === 0}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Exam
                </Button>
                
                {(!exam.questions || exam.questions.length === 0) && (
                  <p className="text-red-500 mt-2">No questions available for this exam</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  // إذا لم يكن هناك سؤال حالي، عرض رسالة خطأ
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">No Questions Available</h2>
            <p className="text-muted-foreground mb-6">This exam doesn't have any questions yet.</p>
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
                <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
              
              {/* Progress */}
              <div className="hidden md:block">
                <div className="text-sm text-muted-foreground mb-1 text-center">
                  {answers.length}/{exam.questions.length} answered
                </div>
                <Progress value={getProgressPercentage()} className="w-32 h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Question</h3>
                      <p className="text-sm text-muted-foreground">Select the correct answer</p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-sm">
                    {Math.round((100 / exam.questions.length) * (currentQuestionIndex + 1))}% Complete
                  </Badge>
                </div>

                {/* Question Text */}
                <div className="mb-8">
                  <p className="text-lg leading-relaxed text-gray-800">
                    {currentQuestion.question_text}
                  </p>
                </div>

                {/* Choices */}
                <RadioGroup 
                  value={getCurrentAnswer(currentQuestion.id)?.toString() || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                  className="space-y-4"
                >
                  {currentQuestion.choices.map((choice, index) => (
                    <div 
                      key={choice.id}
                      className={`
                        flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${getCurrentAnswer(currentQuestion.id) === choice.id 
                          ? 'border-primary bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => handleAnswerSelect(currentQuestion.id, choice.id)}
                    >
                      <RadioGroupItem value={choice.id.toString()} id={`choice-${choice.id}`} />
                      <Label 
                        htmlFor={`choice-${choice.id}`}
                        className="flex-1 cursor-pointer text-base font-normal"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${getCurrentAnswer(currentQuestion.id) === choice.id
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-800">{choice.choice_text}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </span>
                
                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button 
                    onClick={submitExam}
                    disabled={submitting || answers.length === 0}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Exam
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestionIndex === index ? "default" : "outline"}
                      size="sm"
                      className={`
                        h-10 w-10 p-0 rounded-lg font-medium
                        ${getQuestionStatus(index) === "answered" 
                          ? currentQuestionIndex === index 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600"
                        }
                      `}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
                    <span className="text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></div>
                    <span className="text-muted-foreground">Unanswered</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary border border-primary"></div>
                    <span className="text-muted-foreground">Current</span>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <div className="font-semibold mb-1">Progress</div>
                    <div>{answers.length} of {exam.questions.length} questions answered</div>
                    <Progress value={getProgressPercentage()} className="mt-2 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;