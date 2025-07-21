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
                <div key={tech.title} className="p-4 rounded-xl bg-white hover:bg-[#F2F4F8] h-[100px] w-[642px] px-[20px] py-[12px] gap-[20px]">
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <img src={tech.image} alt={tech.title} className="w-[76px] h-[76px]" />
                      <div className=''>
                        <p className="font-poppins text-black font-[500] text-[20px] leading-[26px] text-line-height-[26px]">{tech.title}</p>
                        <p className="font-poppins text-[#999FAA] font-[400] text-[16px] leading-[20px] max-w-90 items-center justify-center">{tech.description}</p>
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