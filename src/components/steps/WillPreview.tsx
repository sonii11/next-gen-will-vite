import React from 'react';
import { ArrowRight, Download, Share, Edit, CheckCircle, Brain, FileText, Shield } from 'lucide-react';
import { useWillStore } from '../../store/willStore';
import { getStateByCode } from '../../types/states';
import { AIReviewPanel } from '../ui/AIReviewPanel';

interface WillPreviewProps {
  onNext: () => void;
}

export function WillPreview({ onNext }: WillPreviewProps) {
  const { willData } = useWillStore();
  
  // Get user's actual data
  const userName = willData.personalInfo?.fullName || '[Your Name]';
  const userState = willData.personalInfo?.state;
  const stateName = userState ? getStateByCode(userState)?.name || userState : 'California';
  const primaryBeneficiary = willData.beneficiaries?.primaryBeneficiary?.name || '[Primary Beneficiary Name]';
  const primaryPercentage = willData.beneficiaries?.primaryBeneficiary?.percentage || 100;
  const secondaryBeneficiary = willData.beneficiaries?.secondaryBeneficiary?.name;
  const secondaryPercentage = willData.beneficiaries?.secondaryBeneficiary?.percentage || 0;
  const digitalAssets = willData.digitalAssets?.selectedCategories || [];
  const hasDigitalExecutor = willData.beneficiaries?.digitalExecutor?.type === 'different';
  const digitalExecutorName = willData.beneficiaries?.digitalExecutor?.name || '[Digital Executor Name]';
  const waitingPeriod = willData.beneficiaries?.emergencySettings?.waitingPeriod || '30';

  console.log('📋 [WILL_PREVIEW] Rendering will preview with data:', {
    userName,
    stateName,
    primaryBeneficiary,
    primaryPercentage,
    secondaryBeneficiary,
    secondaryPercentage,
    digitalAssets,
    hasDigitalExecutor,
    digitalExecutorName,
    waitingPeriod
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Will Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Last Will and Testament
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 mb-4">State of {stateName}</p>
              
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">
                    I, {userName}, a resident of {stateName}, being of sound mind and memory, 
                    do hereby make, publish, and declare this to be my Last Will and Testament.
                  </h4>
                </div>
                
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h5 className="font-semibold text-blue-800">Digital Assets Provisions</h5>
                  <p className="text-blue-700 mt-1">
                    I hereby grant my Digital Executor full authority to access, manage, transfer, 
                    or delete my digital assets including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
                    {digitalAssets.includes('bitcoin') || digitalAssets.includes('ethereum') || digitalAssets.includes('other-crypto') ? (
                      <li>Cryptocurrency wallets and exchange accounts</li>
                    ) : null}
                    {digitalAssets.includes('google-drive') || digitalAssets.includes('dropbox') || digitalAssets.includes('icloud') || digitalAssets.includes('onedrive') ? (
                      <li>Cloud storage accounts (Google Drive, Dropbox, iCloud, OneDrive)</li>
                    ) : null}
                    {digitalAssets.includes('facebook') || digitalAssets.includes('instagram') || digitalAssets.includes('twitter') || digitalAssets.includes('linkedin') ? (
                      <li>Social media accounts and profiles</li>
                    ) : null}
                    {digitalAssets.includes('domains') || digitalAssets.includes('ecommerce') || digitalAssets.includes('saas') || digitalAssets.includes('subscriptions') ? (
                      <li>Digital business assets and domain names</li>
                    ) : null}
                  </ul>
                </div>
                
                {(digitalAssets.includes('bitcoin') || digitalAssets.includes('ethereum') || digitalAssets.includes('other-crypto')) && (
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h5 className="font-semibold text-green-800">Cryptocurrency Specific Instructions</h5>
                    <p className="text-green-700 mt-1">
                      My cryptocurrency assets shall be transferred according to the detailed access 
                      instructions stored separately with this will. My Digital Executor is authorized 
                      to convert these assets to fiat currency if needed for distribution to beneficiaries.
                    </p>
                  </div>
                )}
                
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                  <h5 className="font-semibold text-purple-800">Beneficiary Designations</h5>
                  <div className="text-purple-700 mt-1 space-y-1">
                    <p>I give, devise, and bequeath my digital assets as follows:</p>
                    <ul className="list-disc list-inside ml-4">
                      <li>{primaryBeneficiary}: {primaryPercentage}% of all digital assets</li>
                      {secondaryBeneficiary && (
                        <li>{secondaryBeneficiary}: {secondaryPercentage}% of all digital assets</li>
                      )}
                    </ul>
                  </div>
                </div>

                {hasDigitalExecutor && (
                  <div className="p-3 border-l-4 border-indigo-500 bg-indigo-50">
                    <h5 className="font-semibold text-indigo-800">Digital Executor Appointment</h5>
                    <p className="text-indigo-700 mt-1">
                      I hereby appoint {digitalExecutorName} as my Digital Executor, granting them 
                      full authority to access, manage, and distribute my digital assets according 
                      to the terms of this will.
                    </p>
                  </div>
                )}
                
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <h5 className="font-semibold text-yellow-800">Emergency Access Protocol</h5>
                  <p className="text-yellow-700 mt-1">
                    My beneficiaries may request emergency access to my digital assets after a {waitingPeriod}-day 
                    waiting period, subject to verification requirements including death certificate 
                    and confirmation from multiple contacts.
                  </p>
                </div>

                <div className="p-3 border-l-4 border-gray-500 bg-gray-50">
                  <h5 className="font-semibold text-gray-800">Legal Compliance</h5>
                  <p className="text-gray-700 mt-1">
                    This will has been prepared in accordance with the laws of {stateName} and 
                    includes specific provisions for digital asset inheritance as recognized 
                    under the Revised Uniform Fiduciary Access to Digital Assets Act.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Preview
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Share className="w-4 h-4" />
                Share for Review
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Will Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Testator:</span>
                <span className="font-medium">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State:</span>
                <span className="font-medium">{stateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Digital Asset Types:</span>
                <span className="font-medium">{digitalAssets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Beneficiary:</span>
                <span className="font-medium text-green-600">✓ {primaryBeneficiary} ({primaryPercentage}%)</span>
              </div>
              {secondaryBeneficiary && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Secondary Beneficiary:</span>
                  <span className="font-medium text-green-600">✓ {secondaryBeneficiary} ({secondaryPercentage}%)</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Digital Executor:</span>
                <span className="font-medium text-green-600">
                  ✓ {hasDigitalExecutor ? digitalExecutorName : 'Same as primary beneficiary'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State Compliance:</span>
                <span className="font-medium text-green-600">✓ {stateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Access:</span>
                <span className="font-medium text-green-600">✓ {waitingPeriod} days</span>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">You're Almost Protected! 🎉</h3>
              <p className="text-sm opacity-90 mb-4">
                Your digital legacy is almost secure. Complete payment to finalize your will.
              </p>
              
              <button 
                onClick={onNext}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold inline-flex items-center gap-2"
              >
                Secure Your Digital Will - $49 <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs opacity-75 mt-2">30-day money-back guarantee</p>
            </div>
          </div>
        </div>

        {/* AI Review Sidebar */}
        <div className="lg:col-span-1">
          <AIReviewPanel className="sticky top-4" />
        </div>
      </div>
    </div>
  );
}