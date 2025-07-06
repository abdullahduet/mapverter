import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import TypeAnimation from '../components/common/TypeAnimation';
import Button from '../components/common/Button';
import { features } from '../data/featuresData';
import { CSV_SAMPLE, JSON_SAMPLE, useCases } from '../utils/constants';


const Home = () => {
  return (
    <>
      <SEOHead
        title="Mapverter | Data Transformation Platform | Generate, Map, Convert, Transform, Validate and Visualize data"
        description="Generate, Map, Convert, Transform, Validate and Visualize data with our intuitive web-based tools seamlessly. Perfect for developers, analysts, and healthcare companies. Easily convert CSV to JSON, EDI to JSON, and more. Streamline your data workflows with our powerful CSV generator, mapper, and validator. Explore our features for data conversion, mapping, validation, and visualization."
        keywords="csv generator, csv mapping, csv converter, csv to json, csv validator, csv visualization, csv mapper, web-based tools, data conversion, data validation, data visualization tools, json mapping, json converter, json to csv, data tools, map data online, convert data online, transform data online, visualize data online, EDI mapping, EDI converter, EDI to json, EDI generator, EDI validator, EDI visualization, x12 edi, edifact, healthcare edi"
      />

      {/* Hero Section - Updated for multi-format */}
      <div className="relative px-4 pt-32 pb-20 md:pt-40 md:pb-32 min-h-[85vh] bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-100/20 dark:to-blue-900/10"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight">
              The Ultimate Data
              <br />
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
                className="text-blue-811 dark:text-blue-600"
              />
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              Mapverter is your universal data transformation platform. Convert, map, validate, and visualize data across CSV, JSON, EDI, and more formats with our intuitive tools.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/convert">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Start Converting
                </Button>
              </Link>

              <Link to="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Try Live Demo
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No Installation Required
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Export unlimited
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure & Private
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Lightning Fast
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Format Cards Section */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Supported Data Formats
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Work with the data formats you need. Convert between formats seamlessly with our powerful transformation engine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* CSV Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-8 border border-green-200 dark:border-green-800 hover:shadow-lg">
              <div className="w-16 h-16 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">CSV Files</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                The universal format for spreadsheet data. Perfect for Excel users, data analysts, and database exports.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Generate test data
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Map & transform columns
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Visual editing interface
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Data analysis
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Excel compatible
                </li>
              </ul>
            </div>

            {/* JSON Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800 hover:shadow-lg">
              <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">JSON Data</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                The standard for modern APIs and web applications. Ideal for developers and system integrations.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Format & beautify
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Schema validation
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Nested data support
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Web development
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  NoSQL databases
                </li>
              </ul>
            </div>

            {/* EDI Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800 hover:shadow-lg">
              <div className="w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">EDI Files</h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-6">
                Essential for healthcare and logistics. Support for X12, EDIFACT, and other EDI standards.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  X12 & EDIFACT support
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Healthcare transactions
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Segment mapping
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Supply chain
                </li>
                <li className="flex items-center text-neutral-700 dark:text-neutral-300">
                  <svg className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  B2B commerce
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {import.meta.env.isActiveCsvFeatures && (
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
      )}

      {/* Key Features Grid */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Powerful Data Transformation Tools
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Everything you need to work with data, all in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Data Generator
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Create sample data files with customizable structures and realistic test data
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Visual Mapping
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Drag-and-drop interface to map fields between different data structures and formats.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Smart Conversion
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Automatically detect and convert between formats with intelligent field mapping and type detection.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Data Validation
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Ensure data integrity with built-in validation rules for each format and custom business rules.
              </p>
            </div>

            {import.meta.env.isActiveApiAndBatch && (
              <>
                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Batch Processing
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Process multiple files at once with our high-performance batch conversion engine.
                  </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    API Integration
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    RESTful API for seamless integration with your existing workflows and applications.
                  </p>
                </div>
              </>
            )}

            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Data Visualization
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Preview and analyze your data with interactive charts and visual representations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {import.meta.env.isActiveHowItWorksSection && (
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
      )}

      {/* Use Cases Section */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Built for Your Industry
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Trusted by developers, analysts, and enterprises across industries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Developers</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Integrate data conversion into your applications with our API. Support multiple formats without complex libraries.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Business Analysts</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Transform data between systems without coding. Clean, validate, and prepare data for analysis and reporting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Healthcare</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Process EDI 837, 835, and other healthcare transactions. Convert between EDI and modern formats seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      {import.meta.env.isActiveUseCasesSection && (
        <section className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Built for Your Workflow
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Whether you're a developer, analyst, or healthcare professional, Mapverter adapts to your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-8"
                >
                  <div className="text-blue-600 dark:text-blue-400 mb-4">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    {useCase.title}
                  </h3>
                  <ul className="space-y-3">
                    {useCase.points.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-neutral-700 dark:text-neutral-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Example Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              See It in Action
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
              Transform complex data structures with just a few clicks. Browse our examples to see how Mapverter can transform your data.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 md:p-8 shadow-medium">
              <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">Real-World Example: CSV to JSON Conversion</h3>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-500">Input: CSV Data</h4>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded border border-neutral-200 dark:border-neutral-700 overflow-auto max-h-64">
                    <pre className="text-sm text-neutral-800 dark:text-neutral-200 font-mono">
                      {CSV_SAMPLE}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-500">Output: JSON Format</h4>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded border border-neutral-200 dark:border-neutral-700 overflow-auto max-h-64">
                    <pre className="text-sm text-neutral-800 dark:text-neutral-200 font-mono">
                      {JSON_SAMPLE}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link to="/demo">
                  <Button variant="primary" className="bg-blue-811 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700">
                    Try Live Demo
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
            Ready to Transform Your Data?
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
          {import.meta.env.isActiveCTASection && (
            <p className="mt-6 text-sm text-blue-100">
              Free plan available • No credit card required • Cancel anytime
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;