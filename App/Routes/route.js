var express = require('express');
var app = express();

var router = express.Router();
var StudentController = require('./../Controller/StudentController');
var FacultyController = require('./../Controller/FacultyController');
var SubjectController = require('./../Controller/SubjectController');



router.get('/students', StudentController.studentList);
router.post('/student', StudentController.createStudent);
router.put('/student/:student_id', StudentController.updateStudent);
router.delete('/student/:student_id', StudentController.deleteStudent);


router.get('/faculties', FacultyController.facultyList);
router.post('/faculty', FacultyController.createFaculty);
router.put('/faculty/:faculty_id', FacultyController.updateFaculty);
router.delete('/faculty/:faculty_id', FacultyController.deleteFaculty);


router.get('/subjects', SubjectController.subjectList);
router.post('/subject', SubjectController.createSubject);
router.put('/subject/:subject_id', SubjectController.updateSubject);
router.delete('/subject/:subject_id', SubjectController.deleteSubject);


module.exports = router;