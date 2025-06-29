export default function TailwindTest() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Tailwind CSS Test Page</h1>
      <p className="text-lg text-foreground-secondary mb-4">
        This page tests if Tailwind CSS is working correctly.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Card 1</h2>
          <p>This card uses Tailwind classes for styling.</p>
          <button className="mt-3 bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover">
            Button
          </button>
        </div>
        <div className="bg-surface-hover p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Card 2</h2>
          <p>Testing different background colors.</p>
          <button className="mt-3 bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover">
            Button
          </button>
        </div>
        <div className="bg-primary-light p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Card 3</h2>
          <p>With primary-light background.</p>
          <button className="mt-3 bg-success text-white px-4 py-2 rounded hover:bg-success-dark">
            Button
          </button>
        </div>
      </div>
    </div>
  );
}
