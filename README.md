# GenAtlas

GenAtlas is a modern, high-performance web application designed to search, process, and display comprehensive genomic data. Providing an intuitive interface for exploring gene variants, associations, sequences, and scholarly papers, GenAtlas serves as a powerful dashboard for bioinformaticians and genetics researchers.

## Features

- **Gene Overview**: Quick insights into gene characteristics, biotypes, locations, and assembly metrics (GRCh38 / hg38).
- **Variant Analytics**: Detailed distributions of mutation types and consequences, highlighted via interactive charts and sortable data tables.
- **Sequence Intelligence**: GC content calculations and base composition visualizations.
- **Disease Associations**: Information on related phenotypes and conditions.
- **Research Literature**: Direct integrations with NCBI PubMed to source relevant academic papers.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for a fluid design.

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS for responsive and modern aesthetics
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js & Express.js
- **API Services**: Custom integrations to fetch data from Ensembl and NCBI
- **Middleware**: CORS and Dotenv

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/subodh-baniya/Genatlas.git
   cd Genatlas
   ```

2. **Backend Setup:**
   Navigate to the backend directory, install dependencies, and start the server.
   ```bash
   cd Backend
   npm install
   npm start
   ```
   > The backend runs on `http://localhost:3001` by default. Make sure this port is free, or adjust your `.env` configuration.

3. **Frontend Setup:**
   Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite development server.
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

## Usage

1. Open the GenAtlas application in your browser.
2. In the central search bar, type in a gene symbol (e.g., *BRCA1*, *TP53*).
3. The dashboard will populate with:
   - Gene metadata
   - Variant tables and graphical mutation distributions
   - Associated diseases and phenotypes
   - Sequence intelligence metrics
   - Latest research papers from PubMed

## Project Structure

```text
GenAtlas/
├── Backend/               # Express.js REST API
│   ├── src/
│   │   ├── Controller/    # Request handlers
│   │   ├── Routes/        # Express routers
│   │   ├── middleware/    # Custom middlewares
│   │   ├── services/      # Business logic and external API calls
│   │   └── index.js       # Express server entry point
│   └── package.json
└── Frontend/              # React Vite Application
    ├── src/
    │   ├── components/    # Reusable UI components (Dashboard, Charts, Panels)
    │   ├── App.jsx        # Main React application component
    │   ├── main.jsx       # React DOM rendering
    │   └── index.css      # Tailwind & global styles
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
