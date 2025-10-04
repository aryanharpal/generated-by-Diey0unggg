export function AppFooter() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AmplifyAI. All rights reserved. Built with ❤️ at Cloudflare.</p>
        <p className="mt-2 max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> This tool uses AI to generate content. For self-deployment, you must provide your own API keys. AI output may require fact-checking.
        </p>
      </div>
    </footer>
  );
}