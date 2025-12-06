export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">PromptVault</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Store, organize, and reuse your AI prompts with variable templates.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/login"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Get started
          </a>
          <a
            href="https://github.com/your-repo/prompt-vault"
            className="text-sm font-semibold leading-6"
          >
            View on GitHub <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}
