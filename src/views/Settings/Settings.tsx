import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import LogoutModal from "@/views/Dashboard/LogoutModal"
import { AlertCircle, HelpCircle, Flag, Trash2, X } from "lucide-react"
import { deleteAccount, reportSuspiciousActivity } from "@/api/user"
import toast from "react-hot-toast"

export default function Settings() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reportActivityDialog, setReportActivityDialog] = useState(false)
  const [activityDescription, setActivityDescription] = useState("")
  const [relatedUser, setRelatedUser] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      await deleteAccount()
      toast.success("Account deleted successfully")
      setTimeout(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/"
      }, 1000)
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Failed to delete account. Please try again.")
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleReportActivity = async () => {
    if (!activityDescription.trim()) {
      toast.error("Please describe the suspicious activity")
      return
    }

    try {
      setIsLoading(true)
      await reportSuspiciousActivity({
        description: activityDescription,
        relatedUser: relatedUser || null,
      })
      toast.success("Report submitted successfully. Our team will review it shortly.")
      setActivityDescription("")
      setRelatedUser("")
    } catch (error) {
      console.error("Error reporting activity:", error)
      toast.error("Failed to submit report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full max-w-3xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8 text-gray-900 dark:text-white'>
        Settings
      </h1>

      {/* Logged In Devices Section */}
      <Card className='mb-6 p-6 border border-gray-200 dark:border-gray-700'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Logged In Devices
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Currently logged in on <strong>1 device</strong> (this device)
          </p>
          <div className='space-y-2'>
            <div className='flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <div className='flex items-center gap-3'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <div>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    This Device
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Windows • Chrome • Active now
                  </p>
                </div>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950'
                disabled
              >
                Current Session
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Logout Section */}
      <Card className='mb-6 p-6 border border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Sign Out
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Sign out from your current session
            </p>
          </div>
          <Button
            onClick={() => setShowLogoutModal(true)}
            variant='outline'
            className='text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
          >
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Help & Support Section */}
      <Card className='mb-6 p-6 border border-gray-200 dark:border-gray-700'>
        <div className='flex items-start gap-4'>
          <HelpCircle className='w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0' />
          <div className='flex-1'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Help & Support
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
              Get answers to common questions about SkillExchange
            </p>

            <div className='mt-4 space-y-3'>
              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  How do I schedule a call with someone?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  Once you have an accepted skill exchange request and are in a chat, you'll see a "Schedule Meeting" option. Click it to set a date and time for your skill exchange session. Both parties will be notified of the scheduled session.
                </p>
              </details>

              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  How are SkillExchanges being measured?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  SkillExchanges are measured through session feedback. After each completed session, both participants provide feedback indicating whether the skill was successfully exchanged. The total count of successful skill exchanges is tracked and displayed on your dashboard. This helps build trust and shows your learning/teaching activity.
                </p>
              </details>

              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  How do I start a skill exchange?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  Browse the Find Skills section to discover users, send a skill exchange
                  request with your offer and ask, and once accepted, you can start
                  chatting and scheduling sessions.
                </p>
              </details>

              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  How are reviews and ratings calculated?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  After completing a session, both users can leave reviews and ratings
                  based on their experience. These contribute to your overall profile
                  rating and help build trust in the community.
                </p>
              </details>

              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  How do I report a problem or issue?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  Use the "Report Suspicious Activity" section below to report any
                  concerns or issues. Our team will review your report and take
                  appropriate action.
                </p>
              </details>

              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  How do I edit my profile and skills?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  Go to Dashboard and click "Edit Profile" to update your information,
                  add skills you can teach, and skills you want to learn. Your changes
                  are saved immediately.
                </p>
              </details>

              <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'>
                <summary className='font-medium text-gray-900 dark:text-white'>
                  Is my data secure and private?
                </summary>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  Yes, we use industry-standard encryption and security practices to
                  protect your data. Personal information is only shared with users
                  you're connected with for skill exchange purposes.
                </p>
              </details>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Suspicious Activity Section */}
      <Card className='mb-6 p-6 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950'>
        <div className='flex items-start gap-4'>
          <Flag className='w-6 h-6 text-yellow-600 dark:text-yellow-500 mt-1 flex-shrink-0' />
          <div className='flex-1'>
            <h2 className='text-lg font-semibold text-yellow-900 dark:text-yellow-200'>
              Report Suspicious Activity
            </h2>
            <p className='text-sm text-yellow-800 dark:text-yellow-300 mt-1'>
              Help us maintain a safe community by reporting any suspicious or
              inappropriate behavior
            </p>

            <div className='mt-4 space-y-3'>
              <div>
                <label className='block text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2'>
                  What happened? (Required)
                </label>
                <Textarea
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder='Describe the suspicious activity...'
                  className='border-yellow-300 dark:border-yellow-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-yellow-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2'>
                  Username of the user involved (Optional)
                </label>
                <input
                  type='text'
                  value={relatedUser}
                  onChange={(e) => setRelatedUser(e.target.value)}
                  placeholder='Enter username if applicable...'
                  className='w-full px-3 py-2 border border-yellow-300 dark:border-yellow-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                />
              </div>

              <Button
                onClick={handleReportActivity}
                disabled={isLoading || !activityDescription.trim()}
                className='w-full bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 text-white'
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Account Section */}
      <Card className='mb-6 p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950'>
        <div className='flex items-start gap-4'>
          <AlertCircle className='w-6 h-6 text-red-600 dark:text-red-500 mt-1 flex-shrink-0' />
          <div className='flex-1'>
            <h2 className='text-lg font-semibold text-red-900 dark:text-red-200'>
              Delete Account
            </h2>
            <p className='text-sm text-red-800 dark:text-red-300 mt-1'>
              Permanently delete your account and all associated data. This action
              cannot be undone.
            </p>

            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant='destructive'
              className='mt-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white'
            >
              <Trash2 className='w-4 h-4 mr-2' />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <Card className='w-full max-w-md mx-4 p-6 border border-red-200 dark:border-red-900'>
            <div className='flex items-start gap-4'>
              <AlertCircle className='w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0' />
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-red-600 dark:text-red-500'>
                  Delete Account Permanently
                </h3>
                <p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>
                  This action cannot be undone. Your account, profile, messages, and all
                  associated data will be permanently deleted from our servers.
                </p>
                <div className='flex gap-3 justify-end mt-4'>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                    variant='outline'
                    className='dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className='bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white'
                  >
                    {isLoading ? "Deleting..." : "Delete Permanently"}
                  </Button>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
