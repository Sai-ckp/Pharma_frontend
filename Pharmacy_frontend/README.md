# Pharmacy Frontend

This project is a frontend application for a pharmacy, built using React, Vite, and Tailwind CSS. It provides a user-friendly interface for browsing and managing pharmacy products.

## Project Structure

```
Pharmacy_frontend
├── index.html          # Main HTML document
├── package.json        # NPM configuration file
├── vite.config.js      # Vite configuration settings
├── postcss.config.cjs  # PostCSS configuration
├── tailwind.config.cjs  # Tailwind CSS configuration
├── .gitignore          # Git ignore file
├── src
│   ├── main.jsx        # Entry point of the React application
│   ├── App.jsx         # Main App component
│   ├── pages
│   │   ├── Home.jsx    # Home page component
│   │   └── Pharmacy.jsx # Pharmacy page component
│   ├── components
│   │   ├── Header.jsx   # Header component
│   │   ├── Footer.jsx   # Footer component
│   │   └── ProductCard.jsx # Product card component
│   ├── services
│   │   └── api.js      # API service functions
│   ├── hooks
│   │   └── useFetch.js  # Custom hook for data fetching
│   ├── styles
│   │   └── index.css    # Global CSS styles
│   └── assets           # Static assets (images, fonts, etc.)
├── public
│   └── robots.txt      # Instructions for web crawlers
└── README.md           # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Pharmacy_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Usage

- The application consists of a home page and a pharmacy page, where users can browse products.
- The header and footer components are included on all pages for navigation and information.
- The `ProductCard` component displays individual product details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.