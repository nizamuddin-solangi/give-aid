import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
const luhn=(c:AbstractControl):ValidationErrors|null=>{const s=(c.value||'').replace(/\D/g,''); if(!s)return null; let sum=0,alt=false; for(let i=s.length-1;i>=0;i--){let n=+s[i];if(alt&&(n*=2)>9)n-=9;sum+=n;alt=!alt} return s.length>=13&&sum%10===0?null:{luhn:true}};
const expiry=(c:AbstractControl):ValidationErrors|null=>{if(!/^\d{2}\/\d{2}$/.test(c.value||''))return {expiry:true};const [m,y]=c.value.split('/').map(Number);const n=new Date(), yy=n.getFullYear()%100;return m>0&&m<13&&(y>yy||(y===yy&&m>=n.getMonth()+1))?null:{expiry:true}};
@Component({standalone:true,imports:[CommonModule,RouterLink,ReactiveFormsModule],templateUrl:'./page.component.html',styleUrl:'./page.component.css',animations:[trigger('loom',[transition('* => *',[style({opacity:.65,transform:'translateY(18px) scale(.985)'}),animate('520ms cubic-bezier(.16,1,.3,1)',style({opacity:1,transform:'none'}))])])]})
export class PageComponent {
 private route=inject(ActivatedRoute); private fb=inject(FormBuilder);
 page=this.route.snapshot.data['page'] as string; weave=signal(0); selected=signal('Children welfare'); amount=signal(2500); done=signal(false); sent=signal(false);
 causes=[['Children welfare','A safe place to learn and play','coral'],['Education','Books, buses and patient teachers','gold'],['Disabled','Tools for fuller participation','leaf'],['Women','Skills that stay in a family','berry'],['Youth','Room to make and lead','blue'],['Elderly','Neighbourhood care, close by','lavender']];
 checkout=this.fb.group({cardholder:['',[Validators.required,Validators.minLength(3)]],card:['',[Validators.required,luhn]],expiry:['',[Validators.required,expiry]],cvv:['',[Validators.required,Validators.pattern(/^\d{3,4}$/)]]});
 contact=this.fb.group({name:['',Validators.required],email:['',[Validators.required,Validators.email]],message:['',Validators.required]});
 weaveAgain(){this.weave.update(v=>v+1)} choose(c:string){this.selected.set(c)} setAmount(n:number){this.amount.set(n)} field(n:string){return this.checkout.get(n)!} invalid(n:string){const c=this.field(n);return c.invalid&&c.touched} donate(){this.checkout.markAllAsTouched();if(this.checkout.valid)this.done.set(true)} submitContact(){this.contact.markAllAsTouched();if(this.contact.valid)this.sent.set(true)}
}
