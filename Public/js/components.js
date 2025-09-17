// components.js

class NavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="header-left">
          <div class="site-title">
            <img src="images/Forgotten-heroes_ Honouring the Unsung.png" alt="Forgotten Heroes" class="site-logo">
          </div>
          <a href="ai-info.html" class="ai-button">AI Powered</a>
        </div>
        <nav class="menu-bar">
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="sport.html">Sport</a></li>
            <li><a href="music.html">Music</a></li>
            <li><a href="film.html">Film</a></li>            
            <li><a href="popculture.html">Popular Culture</a></li>            
            <li><a href="conflict.html">Conflict</a></li>
            <li><a href="robots.html">Bots</a></li>
            <li><a href="about.html">About</a></li>
          </ul>
        </nav>
      </header>
    `;
  }
}
customElements.define("nav-bar", NavBar);

class AiBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <div class="main-container">
    <div class="header-ai-bar">
        <a href="#" id="aiButton" class="ai-button">AI Update</a>
    </div>
    <div id="messageContainer" class="message-container">
    </div>
    <div id="contentContainer" class="content-wrapper">
    </div>
  </div>
 `;
  }
}

customElements.define("ai-bar", AiBar);


class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-left">
          <img src="images/forgotten-legends-banner.jpeg" width="200" height="200" alt="Forgotten Legends Banner">
        </div>

        <div class="footer-middle">
          <p>© 2025 Forgotten Legends. All rights reserved.</p>
        </div>

        <div class="footer-right">
          <h3>Get Involved</h3>
          <p>Submit suggestions for overlooked figures who deserve recognition</p>
          <p>Share your personal memories if you knew any of our featured legends</p>
          <form>
            <input type="text" name="name" placeholder="Name" required>
            <input type="email" name="email" placeholder="Email" required autocomplete="email">
            <textarea name="comments" placeholder="Comments" rows="4"></textarea>
            <button class="btn" type="submit">Submit</button>
          </form>
        </div>
      </footer>
    `;
  }
}
customElements.define("site-footer", SiteFooter);


// class NavBar extends HTMLElement {
//   connectedCallback() {
//     this.innerHTML = `
//         <header>
//         <div class="topnav">
//             <div class="logo-title">
//             <!-- optional logo -->
//             <div class="site-title">
//                 <h1>Forgotten Legends</h1>
//                 <p>Remembering the unsung heroes who shaped our world</p>
//             </div>
//             </div>
//             <nav>
//             <ul>
//                 <li><a href="index.html">Home</a></li>
//                 <li><a href="sport.html">Sport</a></li>
//                 <li><a href="film.html">Film</a></li>
//                 <li><a href="about.html">About</a></li>
//             </ul>
//             </nav>
//         </div>
//         </header>

//     `;
//   }
// }
// customElements.define("nav-bar", NavBar);




        // <header>
        // <div class="topnav">
        //     <h1>Forgotten Legends</h1>
        //     <p>Remembering the unsung heroes who shaped our world</p>
        // </div>
        // <nav>
        //     <ul>
        //     <li><a href="index.html">Home</a></li>
        //     <li><a href="sport.html">Sport</a></li>
        //     <li><a href="film.html">Film</a></li>
        //     <li><a href="about.html">About</a></li>
        //     </ul>
        // </nav>
        // </header>



    //   <header class="topnav-header">
    //     <h1>Forgotten Legends</h1>
    //     <p>Remembering the unsung heroes who shaped our world</p>

    //     <nav class="sticky-nav">
    //       <ul>
    //         <li><a href="index.html">Home</a></li>
    //         <li><a href="sport.html">Sport</a></li>
    //         <li><a href="film.html">Film</a></li>
    //         <li><a href="about.html">About</a></li>
    //       </ul>
    //     </nav>
    //   </header>
