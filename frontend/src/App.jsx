import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AddStudent from "./pages/AddStudent";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import EditStudent from "./pages/EditStudent";
import AddTeacher from "./pages/AddTeacher";
import Teachers from "./pages/Teachers";
import TeacherDetails from "./pages/TeacherDetails";
import EditTeacher from "./pages/EditTeacher";

import Notices from "./pages/Notices";
import NoticeBoard from "./pages/NoticeBoard";
import Achievements from "./pages/Achievements";
import AchievementBoard from "./pages/AchievementBoard";
import TeacherResults from "./pages/TeacherResults";
import Subjects from "./pages/Subjects";
import ExamManagement from "./pages/ExamManagement";
import TeacherMarks from "./pages/TeacherMarks";
import AdminResults from "./pages/AdminResults";
import StudentResults from "./pages/StudentResults";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherAttendanceDetails from "./pages/TeacherAttendanceDetails";
import CollegeHolidays from "./pages/CollegeHolidays";
import TeacherStudentAttendance from "./pages/TeacherStudentAttendance";
import StudentAttendanceDetails from "./pages/StudentAttendanceDetails";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        {/* Dashboard Pages */}

        {/* Admin */}

        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>} />

        <Route
          path="/admin/add-student"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddStudent />
            </ProtectedRoute>
          }
        />

        {/* Student */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* {Student List} */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <Students />
            </ProtectedRoute>
          }
        />

        {/* Student Details  */}

        <Route
          path="/admin/students/:id" element={
            <ProtectedRoute allowedRole="admin">
              <StudentDetails />
            </ProtectedRoute>
          }
        />

        {/* Edit Student Details  */}

        <Route
          path="/admin/students/:id/edit"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditStudent />
            </ProtectedRoute>
          }

        />

        {/* Teacher */}

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Add Teacher  */}


        <Route
          path="/admin/add-teacher"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddTeacher />
            </ProtectedRoute>
          }
        />

        {/* Teacher List */}

        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRole="admin">
              <Teachers />
            </ProtectedRoute>
          }
        />

        {/* Teacher Details  */}

        <Route
          path="/admin/teachers/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <TeacherDetails />
            </ProtectedRoute>
          }
        />

        {/* Edit Teacher  */}

        <Route
          path="/admin/teachers/:id/edit"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditTeacher />
            </ProtectedRoute>
          }
        />

        {/* Notices  */}

        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute allowedRole="admin">
              <Notices />
            </ProtectedRoute>
          }
        />

        <Route
          path="notices"
          element={
            <ProtectedRoute>
              <NoticeBoard />
            </ProtectedRoute>
          }
        />

        {/* Achivements  */}

        <Route
          path="/admin/achievements"
          element={
            <ProtectedRoute allowedRole="admin">
              <Achievements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AchievementBoard />
            </ProtectedRoute>
          }
        />

        {/* Results  */}

        <Route
          path="/teacher/results"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/results"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/results"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentResults />
            </ProtectedRoute>
          }
        />


        {/* Subjects  */}

        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRole="admin">
              <Subjects />
            </ProtectedRoute>
          }
        />

        {/* Exam Management  */}

        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute allowedRole="admin">
              <ExamManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/marks"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherMarks />
            </ProtectedRoute>
          }
        />

        {/* Attendance  */}

        <Route
          path="/admin/teacher-attendance"
          element={
            <ProtectedRoute allowedRole="admin">
              <TeacherAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teacher-attendance/:teacherId"
          element={
            <ProtectedRoute allowedRole="admin">
              <TeacherAttendanceDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/student-attendance"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherStudentAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentAttendanceDetails />
            </ProtectedRoute>
          }
        />

        {/* Holidays  */}

        <Route
          path="/admin/college-holidays"
          element={
            <ProtectedRoute allowedRole="admin">
              <CollegeHolidays />
            </ProtectedRoute>
          }
        />



      </Routes>
    </BrowserRouter>
  );
}

export default App;









