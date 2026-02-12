import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy: false
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      // Simula envio (aqui podes integrar com um backend ou serviço de email)
      console.log('Formulário enviado:', this.formData);

      // Simula delay de envio
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;

        // Reset form após 3 segundos
        setTimeout(() => {
          form.resetForm();
          this.formData = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            privacy: false
          };
          this.submitSuccess = false;
        }, 3000);
      }, 1500);

      // Em caso de erro (descomenta para testar)
      // setTimeout(() => {
      //   this.isSubmitting = false;
      //   this.submitError = true;
      // }, 1500);
    }
  }
}
