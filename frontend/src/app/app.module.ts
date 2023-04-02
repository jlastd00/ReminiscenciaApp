import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistrarUsuarioComponent } from './components/usuarios/registrar-usuario/registrar-usuario.component';
import { VerificarCuentaComponent } from './components/usuarios/verificar-cuenta/verificar-cuenta.component';
import { RecuperarPasswordComponent } from './components/usuarios/recuperar-password/recuperar-password.component';
import { NuevoPasswordComponent } from './components/usuarios/nuevo-password/nuevo-password.component';
import { AdminPacientesComponent } from './components/pacientes/admin-pacientes/admin-pacientes.component';
import { NuevoPacienteComponent } from './components/pacientes/nuevo-paciente/nuevo-paciente.component';
import { DetallePacienteComponent } from './components/pacientes/detalle-paciente/detalle-paciente.component';
import { AdminRecursosComponent } from './components/recursos/admin-recursos/admin-recursos.component';
import { DetalleRecursoComponent } from './components/recursos/detalle-recurso/detalle-recurso.component';
import { NuevoRecursoComponent } from './components/recursos/nuevo-recurso/nuevo-recurso.component';
import { NuevaTerapiaComponent } from './components/terapias/nueva-terapia/nueva-terapia.component';
import { DetalleTerapiaComponent } from './components/terapias/detalle-terapia/detalle-terapia.component';
import { AdminTerapiasComponent } from './components/terapias/admin-terapias/admin-terapias.component';
import { AsociarRecursosComponent } from './components/recursos/asociar-recursos/asociar-recursos.component';
import { AsociarPacientesComponent } from './components/pacientes/asociar-pacientes/asociar-pacientes.component';
import { ModificarTerapiaComponent } from './components/terapias/modificar-terapia/modificar-terapia.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    NavegacionComponent,
    FooterComponent,
    RegistrarUsuarioComponent,
    VerificarCuentaComponent,
    RecuperarPasswordComponent,
    NuevoPasswordComponent,
    AdminPacientesComponent,
    NuevoPacienteComponent,
    DetallePacienteComponent,
    AdminRecursosComponent,
    DetalleRecursoComponent,
    NuevoRecursoComponent,
    NuevaTerapiaComponent,
    DetalleTerapiaComponent,
    AdminTerapiasComponent,
    AsociarRecursosComponent,
    AsociarPacientesComponent,
    ModificarTerapiaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
