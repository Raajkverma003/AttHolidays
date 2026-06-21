import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  founderPhone = '+91 99999 99999';
  founderEmail = 'raajkverma003@gmail.com';
  founderLinkedin = 'https://linkedin.com/in/raj-kumar';
  founderGithub = 'https://github.com/Raajkverma003';
  founderFacebook = 'https://facebook.com';
  founderTwitter = 'https://twitter.com';
  founderInstagram = 'https://instagram.com';
}

