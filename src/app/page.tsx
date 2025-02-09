import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, TrendingUp } from "lucide-react"
import Navigation from "@/components/page-blocks/navigation"
import Footer from "@/components/page-blocks/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Elevate Your Team Building with TeamSync
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your company&apos;s team-building activities. Boost engagement, track progress, and foster a
                  stronger workplace culture.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Calendar className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Easy Scheduling</h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Effortlessly plan and schedule team-building events.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Engagement Tracking</h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Monitor participation and engagement in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <TrendingUp className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-bold">Progress Analytics</h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Measure the impact of your team-building initiatives.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

