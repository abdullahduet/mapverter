import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import Button from '../components/common/Button';

const About = () => {
    const teamMembers = [
        {
            name: "Mohammad Abdullah",
            role: "Co-Founder & CEO",
            bio: "Former data engineer with 10+ years in healthcare tech. Passionate about making data accessible to everyone.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        // {
        //     name: "Michael Rodriguez",
        //     role: "Co-Founder & CTO",
        //     bio: "Full-stack developer and EDI specialist. Led data integration projects at Fortune 500 healthcare companies.",
        //     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        // },
        // {
        //     name: "Dr. Emily Watson",
        //     role: "Head of Product",
        //     bio: "PhD in Computer Science with expertise in data visualization and user experience design.",
        //     image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
        // }
    ];

    const milestones = [
        {
            year: "2022",
            title: "The Beginning",
            description: "Started as a simple CSV generator tool to help developers create test data for their applications."
        },
        {
            year: "2023",
            title: "Growing Demand",
            description: "Added CSV mapping and conversion features as users requested more sophisticated data transformation capabilities."
        },
        {
            year: "2024",
            title: "EDI Integration",
            description: "Expanded into healthcare with comprehensive EDI support, serving hospitals and healthcare technology companies."
        },
        {
            year: "2025",
            title: "Mapverter Launch",
            description: "Rebranded to Mapverter with support for JSON, XML, and advanced data validation across multiple industries."
        }
    ];

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Lightning Fast",
            description: "Process large datasets in seconds with our optimized transformation engine."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Enterprise Security",
            description: "Your data never leaves your browser. All processing happens locally for maximum privacy."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            title: "Industry Compliance",
            description: "Built-in support for healthcare EDI standards, HIPAA compliance, and business regulations."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: "User-Friendly",
            description: "No coding required. Our visual interface makes complex transformations simple and intuitive."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
            ),
            title: "Multiple Formats",
            description: "Convert between CSV, JSON, XML, EDI X12, EDIFACT, and more with intelligent field mapping."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Advanced Analytics",
            description: "Built-in data validation, statistical analysis, and visualization tools for better insights."
        }
    ];

    return (
        <>
            <SEOHead
                title="About Mapverter - Making Data Transformation Simple"
                description="Learn about Mapverter's mission to make complex data transformation accessible to developers, business analysts, and healthcare companies. From CSV tools to enterprise EDI solutions."
                keywords="about mapverter, data transformation, csv tools, edi healthcare, data conversion platform, business intelligence"
            />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                                Making Data Transformation
                                <span className="text-blue-811 dark:text-blue-600"> Simple & Accessible</span>
                            </h1>
                            <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                                From a simple CSV tool to a comprehensive data transformation platform,
                                Mapverter empowers teams to convert, validate, and visualize their data
                                without complex coding or expensive enterprise software.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Statement */}
                <section className="py-20 bg-white dark:bg-neutral-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 md:p-12">
                                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-6">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-neutral-700 dark:text-neutral-300 text-center leading-relaxed">
                                    We believe that data transformation shouldn't require specialized expertise or expensive tools.
                                    Our mission is to democratize data processing by providing intuitive, powerful, and secure
                                    solutions that work for developers, business analysts, and healthcare companies.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story Timeline */}
                {import.meta.env.isActiveStoryTimeline && (
                    <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-12">
                                    Our Journey
                                </h2>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-811 dark:bg-blue-600 hidden md:block"></div>

                                    <div className="space-y-12">
                                        {milestones.map((milestone, index) => (
                                            <div key={index} className="flex items-start">
                                                {/* Timeline dot */}
                                                <div className="flex-shrink-0 w-16 h-16 bg-blue-811 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6 hidden md:flex">
                                                    {milestone.year}
                                                </div>

                                                {/* Content */}
                                                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg flex-1">
                                                    <div className="md:hidden mb-4">
                                                        <span className="bg-blue-811 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                            {milestone.year}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                                        {milestone.title}
                                                    </h3>
                                                    <p className="text-neutral-600 dark:text-neutral-300">
                                                        {milestone.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Who We Serve */}
                <section className="py-20 bg-white dark:bg-neutral-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-4">
                                Who We Serve
                            </h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-300 text-center mb-12 max-w-3xl mx-auto">
                                Developers, Analysts, and Enterprises across industries, our platform adapts to your needs.
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Developers */}
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                        Developers
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                                        Generate test data, transform API responses, and integrate data pipelines without complex libraries.
                                    </p>
                                    <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-2">
                                        <li>• API integration testing</li>
                                        <li>• Database migration tools</li>
                                        <li>• Mock data generation</li>
                                        <li>• Format conversion APIs</li>
                                    </ul>
                                </div>

                                {/* Business Analysts */}
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                        Business Analysts
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                                        Transform data between systems, clean datasets, and prepare reports without technical dependencies.
                                    </p>
                                    <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-2">
                                        <li>• Excel to database imports</li>
                                        <li>• Cross-system mapping</li>
                                        <li>• Data quality validation</li>
                                        <li>• Report preparation</li>
                                    </ul>
                                </div>

                                {/* Healthcare Companies */}
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                        Healthcare Companies
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                                        Process EDI transactions, ensure HIPAA compliance, and streamline healthcare data workflows.
                                    </p>
                                    <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-2">
                                        <li>• EDI 837/835 processing</li>
                                        <li>• HIPAA compliance tools</li>
                                        <li>• Claims data transformation</li>
                                        <li>• HL7 to modern formats</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-4">
                                Why Choose Mapverter
                            </h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-300 text-center mb-12 max-w-3xl mx-auto">
                                Built by data professionals for data professionals, with the features that matter most.
                            </p>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                {import.meta.env.isActiveTeamSection && (
                    <section className="py-20 bg-white dark:bg-neutral-900">
                        <div className="container mx-auto px-4">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-4">
                                    Meet Our Team
                                </h2>
                                <p className="text-lg text-neutral-600 dark:text-neutral-300 text-center mb-12 max-w-3xl mx-auto">
                                    Experienced professionals from healthcare, technology, and data science backgrounds.
                                </p>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="text-center">
                                            <img
                                                src={member.image}
                                                alt={`${member.name}, ${member.role}`}
                                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                            />
                                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                                {member.name}
                                            </h3>
                                            <p className="text-blue-811 dark:text-blue-600 font-medium mb-3">
                                                {member.role}
                                            </p>
                                            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                                                {member.bio}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Values Section */}
                <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-12">
                                Our Core Values
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                        🔒 Privacy First
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        Your data never leaves your browser. All processing happens locally,
                                        ensuring complete privacy and compliance with data protection regulations.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                        🚀 Simplicity & Power
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        Complex data transformations made simple. No coding required,
                                        but powerful enough for enterprise-level data processing needs.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                        🤝 Community Driven
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        We listen to our users and continuously improve based on real-world
                                        feedback from developers, analysts, and healthcare professionals.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-neutral-900 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                        ♿ Accessibility
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        Data transformation tools should be accessible to everyone,
                                        regardless of technical background or physical abilities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-gradient-to-r from-blue-811 to-green-700 dark:from-blue-900 dark:to-green-800">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Data?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who trust Mapverter for their data transformation needs.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/csv/generate">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                                >
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link to="/templates">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                                >
                                    Explore Templates
                                </Button>
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-blue-100">
                            No signup required • Works in your browser • Start in seconds
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
};

export default About;