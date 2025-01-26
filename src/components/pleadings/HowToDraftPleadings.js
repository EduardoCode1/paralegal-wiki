import React, { useState } from 'react';

const InformativeWebsite = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="bg-gray-900 text-white h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        {/* Intro Section */}
        <section>
          <h1 className="text-4xl font-bold mb-4">Basic information for pleadings.</h1>
          <p className="text-lg text-gray-300">
           
          </p>
        </section>

        {/* Details Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">How do you know if the pleadings are already uploaded?</h2>
          <p className="text-lg text-gray-300">
          First we have to identify, if the pleadings are uploaded in the portal, the pleadings appear in the portal as in the example,
           image at the end of this paragraph. First we have to verify if they are already uploaded because we cannot upload pleadings twice, 
           unless it is an amemded, and second, because we do not make pleadings again.
          </p>
        </section>
      {/* Image Section */}
      <section>
          <h2 className="text-2xl font-bold mb-4">Example of pleadings uploaded.</h2>
          <img
            src="https://i.postimg.cc/NFQ7sXP9/474066456-1289577385632811-1065860978024221405-n.png"
            alt="Example of pleadings uploaded."
            className="w-full rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-400 mt-2 text-center">
          </p>
        </section>

      

        {/* Additional Info Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Documents required for pleadings.</h2>
          <p className="text-lg text-gray-300">
          To perform pleadings we first need <strong>“I-862 Notice to Appear”</strong> where we have to identify some points. The document is available in 
          “How to do pleadings Part I”, the document appears this way in the Respondent's website.
          </p>
          <br />
          {/* Image Section */}
      <section>
          <h2 className="text-2xl font-bold mb-4">How to identify NTA.</h2>
          <img
            src="https://i.postimg.cc/j295g0Nx/474489956-1131443084993702-5577097624803274819-n.png"
            alt="Example of pleadings uploaded."
            className="w-full rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-400 mt-2 text-center">
          </p>
        </section>
        <br></br>
        <h2 className="text-2xl font-bold mb-4">How to identify i-589.</h2>
        
          <p className="text-lg text-gray-300 mt-4">
          To identify the i-589 in the client portal, it literally says <strong>"i-589”</strong>, it is valid for 2 years, so if the NTA is dated 2023, 
          we have to request for a new i-589. We can identify the I-589 as follows.
          </p>
        </section>

        {/* Image Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">How to identify NTA.</h2>
          <img
            src="/api/placeholder/800/400"
            alt="Imagen Ilustrativa"
            className="w-full rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-400 mt-2 text-center">
            Descripción o pie de foto para la imagen
          </p>
        </section>
      </div>
    </div>
  );
};

export default InformativeWebsite;