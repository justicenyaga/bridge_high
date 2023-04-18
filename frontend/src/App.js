import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";

import StudentRegisterPage from "./pages/StudentRegisterPage";
import StudentResultsPage from "./pages/StudentResultsPage";

import ClassRegisterPage from "./pages/ClassRegisterPage";
import StudentsResultsPage from "./pages/StudentsResultsPage";
import TechnicalSelections from "./pages/TechnicalSelections";
import SubjectsSelection from "./pages/SubjectsSelection";
import MakeRemarks from "./pages/MakeRemarks";

import EditResultsPage from "./pages/EditResultsPage";
import EditRegisterPage from "./pages/EditRegisterPage";

import SessionsPage from "./pages/SessionsPage";
import StreamsPage from "./pages/StreamsPage";
import FormsPage from "./pages/FormsPage";
import TermListPage from "./pages/TermListPage";
import SubjectListPage from "./pages/SubjectListPage";
import DeptListPage from "./pages/DeptListPage";
import ExamListPage from "./pages/ExamListPage";
import GradingSystemsPage from "./pages/GradingSystemsPage";
import ClassTeachersPage from "./pages/ClassTeachersPage";

import SubjectsAllotmentsPage from "./pages/SubjectsAllotmentsPage";
import ClassAllotmentsPage from "./pages/ClassAllotmentsPage";

import EditStudentT4Selection from "./pages/EditStudentT4Selection";
import EditStudentSubjectSelection from "./pages/EditStudentSubjectSelection";
import EditClassT4Selection from "./pages/EditClassT4Selection";
import EditClassSubjectSelection from "./pages/EditClassSubjectSelection";

import EditSubjectAllotmentPage from "./pages/EditSubjectAllotmentPage";
import EditClassAllotmentsPage from "./pages/EditClassAllotmentsPage";

import EditSessionPage from "./pages/EditSessionPage";
import EditStreamPage from "./pages/EditStreamPage";
import EditFormPage from "./pages/EditFormPage";
import EditTermPage from "./pages/EditTermPage";
import EditSubjectPage from "./pages/EditSubjectPage";
import EditDeptPage from "./pages/EditDeptPage";
import EditExamPage from "./pages/EditExamPage";
import EditGradingSystemPage from "./pages/EditGradingSystemPage";
import EditClassTeacherPage from "./pages/EditClassTeacherPage";

import EditUserPage from "./pages/EditUserPage";
import StudentListPage from "./pages/StudentListPage";
import TeacherListPage from "./pages/TeacherListPage";
import AdminListPage from "./pages/AdminListPage";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer theme="colored" />
      <main className="my-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/registers" element={<ClassRegisterPage />} />
            <Route path="/results" element={<StudentsResultsPage />} />
            <Route path="/register/edit" element={<EditRegisterPage />} />
            <Route path="/results/edit" element={<EditResultsPage />} />

            <Route path="/student/results" element={<StudentResultsPage />} />
            <Route path="/student/register" element={<StudentRegisterPage />} />

            <Route
              path="/student/:id/results"
              element={<StudentResultsPage />}
            />
            <Route
              path="/student/:id/register"
              element={<StudentRegisterPage />}
            />

            <Route
              path="/admin/management/sessions"
              element={<SessionsPage />}
            />
            <Route path="/admin/management/streams" element={<StreamsPage />} />
            <Route path="/admin/management/classes" element={<FormsPage />} />
            <Route path="/admin/management/terms" element={<TermListPage />} />
            <Route path="/admin/management/exams" element={<ExamListPage />} />
            <Route
              path="/admin/management/departments"
              element={<DeptListPage />}
            />
            <Route
              path="/admin/management/subjects"
              element={<SubjectListPage />}
            />
            <Route
              path="/admin/management/grading-systems"
              element={<GradingSystemsPage />}
            />

            <Route
              path="/admin/management/sessions/:id"
              element={<EditSessionPage />}
            />
            <Route
              path="/admin/management/streams/:id"
              element={<EditStreamPage />}
            />
            <Route
              path="/admin/management/classes/:id"
              element={<EditFormPage />}
            />
            <Route
              path="/admin/management/terms/:id"
              element={<EditTermPage />}
            />
            <Route
              path="/admin/management/subjects/:id"
              element={<EditSubjectPage />}
            />
            <Route
              path="/admin/management/departments/:id"
              element={<EditDeptPage />}
            />
            <Route
              path="/admin/management/exams/:id"
              element={<EditExamPage />}
            />
            <Route
              path="/admin/management/grading-systems/:id"
              element={<EditGradingSystemPage />}
            />

            <Route
              path="/admin/teachers/class-teachers"
              element={<ClassTeachersPage />}
            />
            <Route
              path="/admin/teachers/subject-allotments"
              element={<SubjectsAllotmentsPage />}
            />
            <Route
              path="/admin/teachers/class-allotments"
              element={<ClassAllotmentsPage />}
            />

            <Route
              path="/admin/teachers/class-teachers/:id"
              element={<EditClassTeacherPage />}
            />
            <Route
              path="/admin/teachers/subject-allotments/:id"
              element={<EditSubjectAllotmentPage />}
            />
            <Route
              path="/admin/teachers/class-allotments/:id"
              element={<EditClassAllotmentsPage />}
            />

            <Route path="/class/students" element={<StudentListPage />} />
            <Route path="/class/students/:id" element={<EditUserPage />} />
            <Route
              path="/class/t4-selection"
              element={<TechnicalSelections />}
            />
            <Route
              path="/class/subject-selection"
              element={<SubjectsSelection />}
            />
            <Route
              path="/class/t4-selection/student/:id"
              element={<EditStudentT4Selection />}
            />
            <Route
              path="/class/subject-selection/student/:id"
              element={<EditStudentSubjectSelection />}
            />
            <Route
              path="/class/t4-selection/:id"
              element={<EditClassT4Selection />}
            />
            <Route
              path="/class/subject-selection/:id"
              element={<EditClassSubjectSelection />}
            />
            <Route path="/class/remarks" element={<MakeRemarks />} />

            <Route path="/admin/students" element={<StudentListPage />} />
            <Route path="/admin/teachers" element={<TeacherListPage />} />
            <Route path="/admin/admins" element={<AdminListPage />} />
            <Route path="/admin/users/:id" element={<EditUserPage />} />
          </Routes>
        </Container>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
library.add(fab, fas, far);
