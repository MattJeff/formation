// Page de prévisualisation pour le Sandbox
// Cette page est affichée dans l'iframe du panneau d'aperçu

export default function SandboxPreviewPage() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Portfolio Photographe - Aperçu</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            background-color: #1a1a1a;
            color: #ffffff;
          }

          header {
            text-align: center;
            padding: 3rem 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          h1 {
            font-size: 3rem;
            font-weight: 700;
          }

          .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .gallery img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
          }

          .gallery img:hover {
            transform: scale(1.05);
          }

          footer {
            text-align: center;
            padding: 2rem;
            background-color: #0a0a0a;
            margin-top: 3rem;
          }

          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            align-items: center;
            justify-content: center;
          }

          .modal.active {
            display: flex;
          }

          .modal img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
          }

          .modal-close {
            position: absolute;
            top: 20px;
            right: 40px;
            font-size: 40px;
            color: white;
            cursor: pointer;
          }
        `}</style>
      </head>
      <body>
        <header>
          <h1>Chloé Dubois - Photographe</h1>
        </header>

        <main>
          <div className="gallery" id="gallery">
            <img
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400"
              alt="Photo 1"
              className="gallery-image"
            />
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
              alt="Photo 2"
              className="gallery-image"
            />
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400"
              alt="Photo 3"
              className="gallery-image"
            />
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
              alt="Photo 4"
              className="gallery-image"
            />
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
              alt="Photo 5"
              className="gallery-image"
            />
            <img
              src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400"
              alt="Photo 6"
              className="gallery-image"
            />
          </div>
        </main>

        <footer>
          <p>Contact: chloe@example.com</p>
        </footer>

        <div className="modal" id="modal">
          <span className="modal-close" id="modal-close">
            &times;
          </span>
          <img src="" alt="Agrandie" id="modal-image" />
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
          // Script pour la galerie interactive
          const images = document.querySelectorAll('.gallery-image');
          const modal = document.getElementById('modal');
          const modalImage = document.getElementById('modal-image');
          const modalClose = document.getElementById('modal-close');

          images.forEach(img => {
            img.addEventListener('click', () => {
              modal.classList.add('active');
              modalImage.src = img.src;
            });
          });

          modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
          });

          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              modal.classList.remove('active');
            }
          });
        `,
          }}
        />
      </body>
    </html>
  );
}
