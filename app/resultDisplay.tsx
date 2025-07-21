import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"
import { jsPDF } from "jspdf";

export default function resultDisplay(results:any)
{

      const handleSingleDownload = (tech:any)=> {
        const doc = new jsPDF();
    
        doc.setFontSize(16);
        const lines= `Title: ${tech.title}\n   Description: ${tech.description}\n   Category: ${tech.category} `;
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(lines, 180), 10, 20);
        doc.save('Result.pdf');
      }

    return(
        <div className="grid gap-4">
              {results.map((tech:any) => (
                <div key={tech.title} className="p-4 rounded-xl bg-white hover:bg-[#F2F4F8]">
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <img src={tech.image} alt={tech.title} className="w-12 h-12 rounded" />
                      <div className=''>
                        <h3 className="font-semibold">{tech.title}</h3>
                        <p className="text-sm text-gray-500 max-w-90">{tech.description}</p>
                      </div>
                      <div className='absolute right-100'>
                        <button onClick={() => handleSingleDownload(tech)}>
                        <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
    )
}