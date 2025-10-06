import { Component, inject, HostListener } from '@angular/core';
import { OauthService } from '../../services/oauth.service';
import { CommonModule } from '@angular/common';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';

@Component({
  selector: 'app-account-section',
  standalone: true,
  imports: [
    CommonModule,
    SafeUrlPipePipe // <-- ADD THE PIPE TO IMPORTS
  ],
  templateUrl: './account-section.component.html',
  styleUrl: './account-section.component.css'
})
export class AccountSectionComponent {
  oauthService = inject(OauthService);
  userIdentity = this.oauthService.userIdentity;

  isPanelOpen = false;

  /**
   * STANDARD PRACTICE: This listener closes the panel when a user clicks anywhere
   * outside of the component, which is an expected user experience.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isPanelOpen && !target.closest('app-account-section')) {
      this.isPanelOpen = false;
    }
  }

  /**
   * Toggles the panel's visibility.
   * STANDARD PRACTICE: event.stopPropagation() is crucial here. It prevents the click
   * on the profile button from immediately "bubbling up" to the document listener,
   * which would cause the panel to close the instant it opens.
   */
  togglePanel(event: MouseEvent): void {
    event.stopPropagation();
    this.isPanelOpen = !this.isPanelOpen;
  }

  logout(): void {
    this.oauthService.logout();
    this.isPanelOpen = false;
  }
}