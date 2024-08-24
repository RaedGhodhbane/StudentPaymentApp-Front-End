import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../services/students.service';
import { Student } from '../model/students.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students!: Array<Student>;
  studentsDataSource!: MatTableDataSource<Student>;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'code', 'programId', 'photo','payments'];

  constructor(private studentsService: StudentsService,
              private router: Router) { }

  ngOnInit(): void {
    this.studentsService.getStudents().subscribe({
      next: value => {
        this.students = value;
        this.studentsDataSource = new MatTableDataSource<Student>(this.students);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  studentPayments(student: Student) {
    this.router.navigateByUrl(`/admin/student-details/${student.code}`);
    } 

}
