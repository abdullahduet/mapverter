import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import TypeAnimation from '../components/common/TypeAnimation';
import Button from '../components/common/Button';
import { features } from '../data/featuresData';
import { CSV_SAMPLE, JSON_SAMPLE } from '../utils/constants';

const Home = () => {
  return (
    <>
      <SEOHead
        title="Mapverter | Generate, Map, Convert, Transform, Validate and Visualize data"
        description="Mapverter - Generate, Map, Convert, Transform, Validate and Visualize data with our intuitive web-based tools. Perfect for data professionals."
        keywords="csv generator, csv mapping, csv converter, csv to json, csv validator, csv visualization, csv mapper, web-based tools, data conversion, data validation, data visualization tools, json mapping, json converter, json to csv, data tools, map data online, convert data online, transform data online, visualize data online, EDI mapping, EDI converter, EDI to json, EDI generator, EDI validator, EDI visualization"
      />

      {/* Hero Section */}
      <div className="relative px-4 pt-32 pb-20 md:pt-40 md:pb-32 flex items-center min-h-[80vh] bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-200/20 dark:to-neutral-700/20"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight">
              The Ultimate Data
              <TypeAnimation
                sequences={[
                  " Generator", 2500,
                  " Mapper", 3000,
                  " Converter", 2000,
                  " Transformer", 2500,
                  " Validator", 2000,
                  " Visualizer", 2500
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-blue-811 dark:text-blue-811"
              />
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
              Streamlined CSV solutions for complex data challenges.
              Upload, transform, and visualize your CSV data in minutes.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/upload">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Upload CSV
                </Button>
              </Link>

              <Link to="/features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Powerful CSV Tools
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Everything you need to work with CSV data in one place.
              Transform, convert, and visualize your data with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={`/features/${feature.id}`}
                className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-811 dark:bg-blue-811 text-white rounded-full mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {feature.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Our CSV tools make data transformation simple and efficient.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-[21px] top-10 bottom-10 w-1 bg-neutral-300 dark:bg-neutral-600 hidden md:block"></div>

              {[
                {
                  number: "1",
                  title: "Upload Your CSV File",
                  description: "Start by uploading your CSV file. Our tool automatically detects column headers and data types."
                },
                {
                  number: "2",
                  title: "Select Your Transformation",
                  description: "Choose the operation you want to perform: map to another structure, convert to a different format, or validate your data."
                },
                {
                  number: "3",
                  title: "Download or Export Results",
                  description: "Preview your transformed data and download it in your desired format, or continue processing with additional tools."
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start mb-12 last:mb-0">
                  <div className="flex-shrink-0 mr-6 z-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-811 dark:bg-blue-811 text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">{step.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              See It in Action
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Browse our examples to see how Mapverter can transform your data.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 md:p-8 shadow-medium">
              <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">CSV to JSON Conversion Example</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-500">Source CSV</h4>
                  <div className="bg-white dark:bg-neutral-900 p-4 rounded border border-neutral-200 dark:border-neutral-700 overflow-auto max-h-64">
                    <pre className="text-sm text-neutral-800 dark:text-neutral-200 font-mono">
                      {CSV_SAMPLE}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-500">Result JSON</h4>
                  <div className="bg-white dark:bg-neutral-900 p-4 rounded border border-neutral-200 dark:border-neutral-700 overflow-auto max-h-64">
                    <pre className="text-sm text-neutral-800 dark:text-neutral-200 font-mono">
                      {JSON_SAMPLE}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link to="/examples">
                  <Button variant="primary">
                    View More Examples
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-811 to-green-700 dark:from-blue-811 dark:to-green-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your CSV Data?
          </h2>
          <p className="max-w-xl mx-auto text-lg text-green-50 mb-8">
            Join thousands of data professionals who use Mapverter to streamline their data workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Start Processing
              </Button>
            </Link>
            <Link to="/samples">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Try Sample Data
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;