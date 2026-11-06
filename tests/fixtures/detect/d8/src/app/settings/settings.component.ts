import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
@Component({ selector: 'app-settings', standalone: true, imports: [MatButtonModule], template: '<button mat-flat-button>Save</button>' })
export class SettingsComponent {}
