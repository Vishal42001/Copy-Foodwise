import { DisplayCardsDefault } from '@/components/ui/display-cards-default';

const sampleArticles = [
  {
    href: '#',
    category: 'Nutrition',
    title: 'The Essential Guide to Healthy Eating',
    description: 'Discover the secrets to a balanced diet and how to make nutritious choices every day for a healthier lifestyle.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    author: {
      name: 'Dr. Ellen Swanson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      readTime: '7 min read',
    },
  },
  {
    href: '#',
    category: 'Fitness',
    title: 'Workout Plans for Beginners',
    description: 'A comprehensive look at starting your fitness journey with effective and safe workout routines.',
    imageUrl: 'https://images.unsplash.com/photo-1499696010180-0e5f1ef3e0b9',
    author: {
      name: 'Mark Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      readTime: '10 min read',
    },
  },
  {
    href: '#',
    category: 'Mindfulness',
    title: 'Meditation and Its Impact on Mental Health',
    description: 'Exploring the benefits of mindfulness and meditation for reducing stress and improving overall well-being.',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    author: {
      name: 'Aisha Khan',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      readTime: '5 min read',
    },
  },
];

const DemoDisplayCardsPage = () => {
  return (
    <main className="bg-slate-900 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
                Component Demo
            </h1>
            <p className="mt-4 text-lg text-slate-400">
                Display Cards — Default Variant
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 [perspective:1000px]">
          {sampleArticles.map((article, index) => (
            <DisplayCardsDefault key={`default-${index}`} {...article} variant="default" />
          ))}
        </div>

        <div className="text-center my-16">
            <p className="mt-4 text-lg text-slate-400">
                Display Cards — Compact Variant
            </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 [perspective:1000px]">
          {sampleArticles.map((article, index) => (
            <DisplayCardsDefault key={`compact-${index}`} {...article} variant="compact" />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DemoDisplayCardsPage;