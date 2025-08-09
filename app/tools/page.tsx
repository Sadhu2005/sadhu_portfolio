// app/tools/page.tsx
import Image from 'next/image';

export default function ToolsPage() {
  const toolsData = [
    {
      title: "Sample Tool Name",
      description: "A brief description of your tool, what it does, and why it’s useful. Replace this with your real tool info.",
      imageUrl: "/tools/sample_tool.png", // Replace with your actual image path
      toolLink: "https://yourtoollink.com",
      type: "Chrome Extension"
    },
    // Add more tools here
  ];

  return (
    <main>
      <section id="tools-page" style={{ paddingTop: '100px' }}>
        <h2>My Tools</h2>
        <div className="page-grid">
          {toolsData.map((tool, index) => (
            <div key={index} className="tool-card-full">
               <div className="tool-image-wrapper">
                  <Image src={tool.imageUrl} alt={tool.title} width={100} height={100} style={{ objectFit: 'contain' }} />
                </div>
              <div className="tool-info-full">
                <h3>{tool.title}</h3>
                <span className="tool-type">{tool.type}</span>
                <p>{tool.description}</p>
                <a href={tool.toolLink} className="button-primary" target="_blank" rel="noopener noreferrer">Use Tool</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}