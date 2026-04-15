import { getHomePageContent, getFAQContent, FAQItem } from '../lib/kontent';
import KontentEditable from '../components/KontentEditable';

export default async function Home() {
  // Fetch content from Kontent.ai
  const [kontentContent, faqItems] = await Promise.all([
    getHomePageContent(),
    getFAQContent()
  ]);

  // Default content if Kontent.ai is not configured or fails
  const defaultContent = {
    itemId: undefined,
    title: "SecureLife Insurance",
    subtitle: "Protecting Your Future, One Policy at a Time",
    description: "Comprehensive insurance coverage tailored to your needs. From auto and home insurance to life and health policies, we provide reliable protection for you and your loved ones.",
    ctaText: "Get a Quote"
  };

  const content = kontentContent || defaultContent;
  const pageItemId = content.itemId;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SecureLife Insurance</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center" data-kontent-item-id={pageItemId}>
          <KontentEditable
            itemId={pageItemId}
            elementCodename="title"
            tag="h1"
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            {content.title}
          </KontentEditable>
          <KontentEditable
            itemId={pageItemId}
            elementCodename="subtitle"
            tag="p"
            className="text-3xl md:text-4xl font-semibold text-blue-600 mb-6"
          >
            {content.subtitle}
          </KontentEditable>
          <KontentEditable
            itemId={pageItemId}
            elementCodename="description"
            tag="p"
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            {content.description}
          </KontentEditable>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <KontentEditable
              itemId={pageItemId}
              elementCodename="cta_text"
              tag="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {content.ctaText}
            </KontentEditable>
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Insurance</h3>
            <p className="text-gray-600">Protect your home and belongings with comprehensive coverage that gives you peace of mind.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto Insurance</h3>
            <p className="text-gray-600">Drive with confidence knowing you&apos;re protected on the road with our flexible auto policies.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Life Insurance</h3>
            <p className="text-gray-600">Secure your family&apos;s financial future with life insurance policies designed for every stage of life.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-xl mb-8 text-blue-100">Contact our experts today for a personalized insurance quote.</p>
          <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors">
            Contact Us Now
          </button>
        </div>

        {/* FAQ Section */}
        {faqItems.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Find answers to common questions about our insurance services</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <KontentEditable
                        itemId={faq.itemId}
                        elementCodename="question"
                        tag="h3"
                        className="text-lg font-semibold text-gray-900 pr-4"
                      >
                        {faq.question}
                      </KontentEditable>
                      <svg
                        className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6">
                      <KontentEditable
                        itemId={faq.itemId}
                        elementCodename="answer"
                        tag="div"
                        className="rich-text-content"
                        html={faq.answer}
                      />
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SecureLife Insurance</h3>
            <p className="text-gray-400 mb-4">Protecting families and securing futures since 1990</p>
            <p className="text-sm text-gray-500">© 2024 SecureLife Insurance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
