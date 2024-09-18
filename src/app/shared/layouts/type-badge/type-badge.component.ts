import { Component, Input } from '@angular/core';
import { Type } from "../../interfaces/type";

@Component({
  selector: 'app-type-badge',
  templateUrl: './type-badge.component.html',
  styleUrl: './type-badge.component.scss'
})
export class TypeBadgeComponent {
  @Input() types!: Type[];
}
