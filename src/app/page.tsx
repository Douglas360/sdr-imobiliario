import Link from 'next/link';

export const metadata = {
  title: 'SDR Imobiliário | Inteligência Artificial e Vendas 24/7',
  description: 'A revolução do atendimento imobiliário através da tecnologia e inteligência artificial. Atendimento instantâneo, 24 horas por dia.',
};

export default function LandingPage() {
  return (
    <>
      {/* Inject landing-specific fonts and tailwind config override */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      {/* Landing-page scoped styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-page {
          --lp-background: #10131a;
          --lp-surface: #10131a;
          --lp-surface-container-low: #191b23;
          --lp-surface-container: #1d1f27;
          --lp-surface-container-high: #272a32;
          --lp-surface-container-highest: #32353d;
          --lp-surface-bright: #363941;
          --lp-surface-variant: #32353d;
          --lp-primary: #b7c4ff;
          --lp-primary-container: #6989ff;
          --lp-secondary: #bdf4ff;
          --lp-secondary-container: #00e3fd;
          --lp-tertiary: #cfbdff;
          --lp-on-surface: #e1e2ec;
          --lp-on-surface-variant: #c4c5d7;
          --lp-on-secondary: #00363d;
          --lp-on-primary-container: #002172;
          --lp-outline: #8e90a0;
          --lp-outline-variant: #434654;
        }
        .landing-page {
          background-color: var(--lp-background);
          color: var(--lp-on-surface);
          font-family: 'Inter', sans-serif;
        }
        .landing-page .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .landing-page .glow-button {
          box-shadow: 0px 0px 15px rgba(0, 227, 253, 0.3);
        }
        .landing-page .glass-nav {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .landing-page .font-headline { font-family: 'Plus Jakarta Sans', sans-serif; }
        .landing-page .font-body { font-family: 'Inter', sans-serif; }
        .landing-page .font-label { font-family: 'Space Grotesk', sans-serif; }
      `}} />

      <div className="landing-page selection:bg-[#00e3fd] selection:text-[#00363d]">
        {/* TopAppBar / Nav */}
        <nav className="fixed top-0 w-full z-50 bg-[#10131a]/80 glass-nav shadow-[0px_0px_40px_rgba(0,33,114,0.06)]">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
            <div className="text-xl font-black text-[#b7c4ff] font-headline tracking-tight">SDR Imobiliário</div>
            <div className="hidden md:flex items-center gap-8">
              <a className="text-[#c4c5d7] hover:text-[#b7c4ff] transition-colors font-medium" href="#funcionalidades">Funcionalidades</a>
              <a className="text-[#c4c5d7] hover:text-[#b7c4ff] transition-colors font-medium" href="#precos">Preços</a>
              <a className="text-[#c4c5d7] hover:text-[#b7c4ff] transition-colors font-medium" href="#depoimentos">Depoimentos</a>
              <a className="text-[#c4c5d7] hover:text-[#b7c4ff] transition-colors font-medium" href="#faq">FAQ</a>
            </div>
            <Link
              href="/login"
              className="bg-[#00e3fd] text-[#00363d] px-6 py-2.5 rounded-xl font-bold glow-button hover:scale-95 transition-all duration-200 ease-in-out"
            >
              Acessar Plataforma
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#b7c4ff] rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#363941] text-[#bdf4ff] text-sm font-label uppercase tracking-widest">Tecnologia SDR 24/7</span>
              <h1 className="text-5xl md:text-7xl font-extrabold font-headline text-[#e1e2ec] leading-[1.1] tracking-tight">
                Transforme o atendimento da sua imobiliária com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b7c4ff] to-[#bdf4ff]">inteligência artificial</span> e SDR humano 24/7
              </h1>
              <p className="text-xl text-[#c4c5d7] max-w-xl leading-relaxed">
                Fila organizada, histórico claro e ação imediata sobre cada lead vindo do WhatsApp. Escalabilidade sem perder a pessoalidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#00e3fd] text-[#00363d] px-8 py-4 rounded-xl font-bold text-lg glow-button hover:scale-95 transition-all">
                  Quero Escalar minhas Vendas
                </button>
                <button className="border border-[#434654] text-[#e1e2ec] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1d1f27] transition-all">
                  Ver Demonstração
                </button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#b7c4ff]/20 rounded-xl blur-3xl group-hover:bg-[#b7c4ff]/30 transition-all"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Dashboard Preview"
                className="relative rounded-xl border border-[#434654]/15 shadow-2xl z-10 transform lg:rotate-3 lg:scale-110 transition-transform duration-500 group-hover:rotate-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDfKKPYowheEye69z97qwOYzoiIRL1_6bobuJxjB8rRGHPr-COhkx2GDAv5iMapNCc3b4WQ59hSzU9WCvZq2D7YTxs1lHhQlznJRK2jslgjOcpm-27EHP2sGg0HkA_C1TPqLgNnjkG8I--OXfz9hza267h8KpTH8yFKEXwx9KmPH9Bh6IfvsKEph_2a24R6ffeFtwJKLbwbTswzHB3lAeR-qkRxswDOC1SvdR6_TS10McKUZiLO3pAWyNneAVlPuxFScKbuaL1a5GS"
              />
            </div>
          </div>
        </header>

        {/* Social Proof */}
        <section className="py-20 bg-[#191b23]">
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-center text-[#c4c5d7] font-label uppercase tracking-[0.2em] mb-12">Confiado por grandes imobiliárias</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-[#b7c4ff]">apartment</span>
                <span className="font-headline font-bold text-2xl">Lopes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-[#b7c4ff]">house</span>
                <span className="font-headline font-bold text-2xl">QuintoAndar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-[#b7c4ff]">real_estate_agent</span>
                <span className="font-headline font-bold text-2xl">RE/MAX</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-[#b7c4ff]">foundation</span>
                <span className="font-headline font-bold text-2xl">Zap+</span>
              </div>
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl bg-[#32353d] border-t-2 border-[#b7c4ff]">
                <h3 className="text-5xl font-extrabold text-[#bdf4ff] mb-2">+50%</h3>
                <p className="text-[#c4c5d7]">Aumento na taxa de conversão de leads frios.</p>
              </div>
              <div className="p-8 rounded-xl bg-[#32353d] border-t-2 border-[#b7c4ff]">
                <h3 className="text-5xl font-extrabold text-[#bdf4ff] mb-2">24h</h3>
                <p className="text-[#c4c5d7]">Atendimento ininterrupto, sem leads perdidos.</p>
              </div>
              <div className="p-8 rounded-xl bg-[#32353d] border-t-2 border-[#b7c4ff]">
                <h3 className="text-5xl font-extrabold text-[#bdf4ff] mb-2">12s</h3>
                <p className="text-[#c4c5d7]">Tempo médio de primeira resposta no WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades (Bento Grid) */}
        <section className="py-32" id="funcionalidades">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-20 space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold font-headline leading-tight">Uma operação completa na palma da sua mão.</h2>
              <p className="text-[#c4c5d7] text-lg">Tecnologia proprietária desenhada especificamente para o mercado imobiliário de alto padrão.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
              {/* Inbox Inteligente */}
              <div className="md:col-span-8 rounded-xl bg-[#1d1f27] overflow-hidden flex flex-col group cursor-pointer hover:bg-[#272a32] transition-colors">
                <div className="p-10 pb-0">
                  <div className="flex items-center gap-3 text-[#b7c4ff] mb-4">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span className="font-label uppercase tracking-widest text-sm">Próxima Geração</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Inbox Inteligente</h3>
                  <p className="text-[#c4c5d7] max-w-md">Gestão de conversas com contexto comercial. A IA identifica o interesse do lead e o SDR humano entra para fechar o agendamento.</p>
                </div>
                <div className="mt-auto pt-10 px-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Inbox UI"
                    className="rounded-t-xl border-x border-t border-[#434654]/20 shadow-2xl group-hover:translate-y-[-10px] transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn6D44Anvs-FpiOvGNL5u3sPO2RyYRkyAP7VX7RM-bH1B9QMvhIz5_5eFAGLzDmyriZFPY_GVLrWD0U070QYfXNR6KjfpzeE5KQeIJ8Av17Glm6V8Kef6Dg3SAG_XRviJqgk6oRHONI6X5OVLJq7sHZ674Cxx70D2ftUivzyxRoLjTN15_FVOpggsrDlkhNHrklSMN6PYQQlv1fjKRwfCogMZcsQFlyfcDwZtz9BjOp6IZkHJVzZlE2JFco6CRrqt37CqPyhKFYkAb"
                  />
                </div>
              </div>
              {/* Catálogo */}
              <div className="md:col-span-4 rounded-xl bg-[#191b23] overflow-hidden flex flex-col group cursor-pointer hover:bg-[#1d1f27] transition-colors">
                <div className="p-10">
                  <div className="flex items-center gap-3 text-[#b7c4ff] mb-4">
                    <span className="material-symbols-outlined">inventory_2</span>
                    <span className="font-label uppercase tracking-widest text-sm">Organização</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Catálogo e Importação</h3>
                  <p className="text-[#c4c5d7]">Seus imóveis organizados em uma vitrine digital integrada ao WhatsApp para envio instantâneo.</p>
                </div>
                <div className="mt-auto">
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-[#32353d] rounded-lg overflow-hidden border border-[#434654]/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Property 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAJ4bTSByg0v-cpmn-0WicOrE7GRpizrG4pr5x0sFN_YFcJGMFgKnL5j1IzNf5Qrrb9GifyBYkcsJgwmO5FZWQd2E93mkSZgu7HQjxNHy2i-Y5jMIbqxZYdyd7LhYHwpU0NDh6Rn2uAKciK0t54K7e0Iy4g5-3IPLGXAnmv6EJ7KY-7vMji_AiEaDHRCUtvKyfHfiC2wEjAsq5c8U4QpDt48bnr15bLZfSAyJJv-rhVp5Wfxai2t-PhSbPfyM_oYxOsHbXkTOcMQz6" />
                    </div>
                    <div className="aspect-square bg-[#32353d] rounded-lg overflow-hidden border border-[#434654]/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Property 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqARzG1Ysbz2MCsetMbKmWh8P-c_toD6gMCRjuOrSLii7AInQe0RC6CFSAZ4s1cyUADsNhjSSXtqtArHYqvzJu1XQwM1DnR1OAClgpXqr55lgChsDXo-DFmdE6iSRWhpd1fJ7gLZd4p1h59S8xTZJ4EZiaAHMG6NsYrpyVSjA70dqBvnVk6RL_2WtzEG0-Ixvtjr085qHwILKgHCEL4MINehfKZuRN7UXHKvT-2z9Qv08TiN4roktx2lzwIvoQvf-7R3SshsDy2lCE" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Dashboard */}
              <div className="md:col-span-12 rounded-xl bg-[#32353d] overflow-hidden grid lg:grid-cols-2 group cursor-pointer hover:bg-[#363941] transition-colors border border-[#434654]/10">
                <div className="p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-[#bdf4ff] mb-4">
                    <span className="material-symbols-outlined">monitoring</span>
                    <span className="font-label uppercase tracking-widest text-sm">Controle Total</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6">Dashboard Executivo</h3>
                  <p className="text-[#c4c5d7] text-lg leading-relaxed mb-8">
                    Visão geral da operação em tempo real. Acompanhe a performance de cada SDR, o volume de leads e a taxa de agendamento por canal.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-[#e1e2ec]">98%</span>
                      <span className="text-xs text-[#c4c5d7] uppercase tracking-wider">Lead Score</span>
                    </div>
                    <div className="w-px h-10 bg-[#434654]"></div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-[#e1e2ec]">5min</span>
                      <span className="text-xs text-[#c4c5d7] uppercase tracking-wider">Avg Response</span>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden flex items-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Dashboard"
                    className="w-full h-[90%] object-cover object-left rounded-tl-2xl shadow-[-20px_0px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGifRi4xCkFW_yKFz35DIGXEeFYagQJVWWAk5I6oqBeLe5n4q09UN9b6FWZkNDqyzvxC2vhAEQXspO-GrPFLMy8HNCeZL1E1qhiNhqLMte565vfFuaSI716lL-ID0-4fx-NkZr9yT66Xx0Jtfguh-ValMaFGg58as0ilM2_ES6Ic9kqgBIWX2QXGGB_UHlxrzP-5kSryn4shaAx8HH0zK9qowWE3RsjtwWNFEs0A2vuoNNcSkkgvfjoRYAZeMD50zx0ydiTLepwSkR"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-32 bg-[#191b23] relative" id="depoimentos">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-bold font-headline">O que dizem os líderes do mercado</h2>
              <p className="text-[#c4c5d7]">Empresas que escalaram sua força de vendas com o SDR Imobiliário.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="p-10 rounded-xl bg-[#32353d] flex flex-col gap-8 border border-[#434654]/10">
                <span className="material-symbols-outlined text-[#bdf4ff] text-5xl opacity-50">format_quote</span>
                <p className="text-lg italic text-[#e1e2ec] leading-relaxed">
                  &ldquo;Implementamos o SDR Imobiliário e em menos de 15 dias nossa taxa de agendamento de visitas dobrou. O atendimento 24h foi o divisor de águas para os leads que chegam à noite.&rdquo;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Ricardo Alencar" className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEOMUzOdGo0-XDXAQwwZJLAltY-h7wT44yhkwMPBJpfTBHbDnKxeX06O1tZpC5XPjQ9riDk3ZJHGXrY0-NlxhSV2J8lgQX-tdxfw9QHdWSAJ-ZOZECCMWNAnWmmdA-k8N7EMxAbOTVLX1VOiTZN4KZfHTn1PW_nBd5QY5zzv6lgxqFuz2WOQ_9vtJcssjE19A_0wAqv2q5rjboGvcNsqkYGbB5n16s9IHndBQJT2Q6JD8kyQ7DWlGHIQydOmE9AHz1e6axSOTZGbIE" />
                  <div>
                    <p className="font-bold">Ricardo Alencar</p>
                    <p className="text-sm text-[#c4c5d7]">Diretor Comercial, Lopes</p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="p-10 rounded-xl bg-[#32353d] flex flex-col gap-8 border border-[#434654]/10">
                <span className="material-symbols-outlined text-[#bdf4ff] text-5xl opacity-50">format_quote</span>
                <p className="text-lg italic text-[#e1e2ec] leading-relaxed">
                  &ldquo;O sistema de inbox inteligente limpa o ruído. Meus corretores agora só recebem leads que realmente querem visitar o imóvel. Produtividade máxima.&rdquo;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Mariana Costa" className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJQ9e0Mml1IbU-LzbMAUTqDuh4ZByQsuAuHVhD-fnfec2S-xJKlBMSmZ6_R5tsIRNuj-TZWqDCRblyRPv93YxBOH1O8akcVc1Kadcjvd3Q7kijzGqHxUU--FSS6DvpL4s_PKtfZkb5MqFPNwzqR5swjhCNJXDr81-_-czcKhilIIuSvlw-unf_ecDOUMzV0fnQJ96AnqurSwiNm5Gdw_6hlFo2lpvR4VT0AcVZIvI9ZtKKj6xgc6290H3c-Pm67tRv5noLNY9oTOn6" />
                  <div>
                    <p className="font-bold">Mariana Costa</p>
                    <p className="text-sm text-[#c4c5d7]">CEO, Costa Imóveis</p>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="p-10 rounded-xl bg-[#32353d] flex flex-col gap-8 border border-[#434654]/10">
                <span className="material-symbols-outlined text-[#bdf4ff] text-5xl opacity-50">format_quote</span>
                <p className="text-lg italic text-[#e1e2ec] leading-relaxed">
                  &ldquo;Não é apenas tecnologia, é o processo humano por trás. O dashboard nos deu uma clareza que nunca tivemos sobre o ROI do nosso marketing no WhatsApp.&rdquo;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="André Martins" className="w-14 h-14 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzs3jfbm58AYC6N3ZxyEe2u22BLKDUYii8ynQ9MmcjyuBcGv2hOxKx1N3FTuwzxCwbixX9T8K7_EgF0N5EGoG57Tzjf6_e6AudnWF5QTx1iLlDCkm1JdrIgrVSh3jx4hPqbbstdtSeWM-gMZu2MWKqXuOhyTwOWLeED0abh-yqM1g19hCS5nLgAQ_BZCiaHQciq7UfE9IFDIKJ4WLnXS4O4HrZr_feT_2EvowE5bOmcAPwHHtj9KJVXed2jq5FjqvzfXyVZ7nCSLkP" />
                  <div>
                    <p className="font-bold">André Martins</p>
                    <p className="text-sm text-[#c4c5d7]">Sócio, Prime Realty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-32 px-8">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6989ff] to-[#32353d] -z-10"></div>
            <div className="absolute top-0 right-0 p-20 bg-[#bdf4ff]/10 rounded-full blur-[100px] -z-10"></div>
            <h2 className="text-4xl md:text-6xl font-extrabold font-headline mb-8 text-[#e1e2ec] leading-tight">
              Pronto para parar de perder leads no WhatsApp?
            </h2>
            <p className="text-xl text-[#002172] mb-12 max-w-2xl mx-auto opacity-90 font-medium">
              Junte-se às imobiliárias que já escalaram sua operação com atendimento instantâneo e inteligente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-[#00e3fd] text-[#00363d] px-10 py-5 rounded-xl font-bold text-xl glow-button hover:scale-105 transition-all">
                Quero Escalar minhas Vendas Agora
              </button>
              <button className="bg-[#10131a]/30 backdrop-blur-md text-[#e1e2ec] px-10 py-5 rounded-xl font-bold text-xl hover:bg-[#10131a]/50 transition-all">
                Falar com Especialista
              </button>
            </div>
            <p className="mt-10 text-[#002172]/70 text-sm font-label flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              Implementação em até 48 horas. Sem taxas ocultas.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#191b23] w-full py-12 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
            <div className="text-lg font-bold text-[#b7c4ff] font-headline">SDR Imobiliário</div>
            <div className="flex gap-8">
              <a className="text-[#c4c5d7] hover:text-[#bdf4ff] transition-colors text-sm font-medium" href="#">Termos de Uso</a>
              <a className="text-[#c4c5d7] hover:text-[#bdf4ff] transition-colors text-sm font-medium" href="#">Privacidade</a>
              <a className="text-[#c4c5d7] hover:text-[#bdf4ff] transition-colors text-sm font-medium" href="#">WhatsApp Suporte</a>
              <a className="text-[#c4c5d7] hover:text-[#bdf4ff] transition-colors text-sm font-medium" href="#">Instagram</a>
            </div>
            <div className="text-sm text-[#c4c5d7] font-body opacity-80">
              © 2024 SDR Imobiliário. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
