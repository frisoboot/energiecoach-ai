'use client';

import Link from 'next/link';
import { useTranslations } from '@/components/LanguageProvider';

export default function AppointmentPage() {
  const { t } = useTranslations();
  const { common, appointment } = t;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {common.backToHome}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{appointment.title}</h1>
          <p className="text-xl text-gray-700">{appointment.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{appointment.personalAdviceTitle}</h2>
                <p className="text-gray-600">{appointment.personalAdviceDescription}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {appointment.benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{appointment.calTitle}</h2>
              <p className="text-gray-600 mb-6">{appointment.calDescription}</p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-gray-700 mb-4">{appointment.calDeveloperNote}</p>

                <div className="bg-white rounded p-4 text-left font-mono text-sm text-gray-600 mb-4">
                  <code className="block">
                    {`{/* Cal.com embed code */}`}
                    <br />
                    {`<Cal`}
                    <br />
                    {`  calLink="megreen/energiecoach"`}
                    <br />
                    {`  style={{ width: "100%", height: "100%", overflow: "scroll" }}`}
                    <br />
                    {`  config={{ layout: "month_view" }}`}
                    <br />
                    {`/>`}
                  </code>
                </div>

                <p className="text-sm text-gray-600 mb-2">{appointment.calCodeHint}</p>
                <a
                  href="https://cal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  {appointment.calLinkText}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{appointment.contactIntro}</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{appointment.contactEmail}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{appointment.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
