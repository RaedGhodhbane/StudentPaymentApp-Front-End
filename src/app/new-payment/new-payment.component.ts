import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentType } from '../model/students.model';
import { StudentsService } from '../services/students.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.css']
})
export class NewPaymentComponent implements OnInit {
  paymentFormGroup!: FormGroup;
  studentCode!: string;
  paymentTypes: string[] = [];
  pdfFileUrl!: string;
  showProgress: boolean = false;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private studentsService: StudentsService) { }

  ngOnInit(): void {
    for (let elt in PaymentType) {
      let value = PaymentType[elt];
      if (typeof value === 'string') {
        this.paymentTypes.push(value);
      }
    }
    this.studentCode = this.activatedRoute.snapshot.params['studentCode'];
    this.paymentFormGroup = this.fb.group({
      date: this.fb.control(''),
      amount: this.fb.control(''),
      type: this.fb.control(''),
      studentCode: this.fb.control(this.studentCode),
      fileSource: this.fb.control(''),
      fileName: this.fb.control(''),
    });
  }

  selectFile(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log('Selected File:', file);
      this.paymentFormGroup.patchValue({
        fileSource: file,
        fileName: file.name
      });
      this.pdfFileUrl = window.URL.createObjectURL(file);
    }
  }

  savePayment() {
    this.showProgress = true;
    if (this.paymentFormGroup.invalid) {
      alert('Form is invalid. Please fill in all required fields.');
      return;
    }

    let date = new Date(this.paymentFormGroup.value.date);
    let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let formData = new FormData();
    formData.set('date', formattedDate);
    formData.set('amount', this.paymentFormGroup.value.amount);
    formData.set('type', this.paymentFormGroup.value.type);
    formData.set('studentCode', this.paymentFormGroup.value.studentCode);
    formData.set('file', this.paymentFormGroup.value.fileSource);

    console.log('date:', formattedDate);
    console.log(formData.get("date"));
    console.log('amount:', this.paymentFormGroup.value.amount);
    console.log(formData.get("amount"));
    console.log('type:', this.paymentFormGroup.value.type);
    console.log(formData.get("type"));
    console.log('studentCode:', this.paymentFormGroup.value.studentCode);
    console.log(formData.get("studentCode"));

    console.log('file:', this.paymentFormGroup.value.fileSource);
    console.log(formData.get("file"));


    console.log(formData);

    this.studentsService.savePayment(formData).subscribe({
      next: value => {
        this.showProgress = false;
        alert('Payment saved successfully!');
      },
      error: err => {
        console.error('Error:', err);
        if (err.error && err.error.message) {
          alert(`Error saving payment: ${err.error.message}`);
        } else if (err.message) {
          alert(`Error saving payment: ${err.message}`);
        } else {
          alert('Error saving payment. Please check the console for details.');
        }
      }
    });
  }

  afterLoadComplete(event : any) {
    console.log(event);
    }
}
