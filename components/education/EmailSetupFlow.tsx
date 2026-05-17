'use client'

import { CheckCircle2, Lock, Mail, Key, Server } from 'lucide-react'

export function EmailSetupFlow({ lang = 'pt' }: { lang?: 'pt' | 'en' | 'es' }) {
  const steps = {
    pt: [
      {
        title: 'Cadastro',
        description: 'Crie sua conta com CPF ou CNPJ',
        icon: Lock,
      },
      {
        title: 'Contratar Servidor',
        description: 'Ative o plano de e-mail próprio',
        icon: Server,
      },
      {
        title: 'Configurar Domínio',
        description: 'Forneça seu domínio e aguarde DNS',
        icon: Mail,
      },
      {
        title: 'Criar E-mails',
        description: 'Adicione os e-mails que deseja (com recuperação)',
        icon: Key,
      },
      {
        title: 'Começar',
        description: 'Seus e-mails estarão prontos em 24-48h',
        icon: CheckCircle2,
      },
    ],
    en: [
      {
        title: 'Sign Up',
        description: 'Create your account with CPF or CNPJ',
        icon: Lock,
      },
      {
        title: 'Subscribe to Email Plan',
        description: 'Activate your private email service',
        icon: Server,
      },
      {
        title: 'Configure Domain',
        description: 'Provide your domain and DNS pointers',
        icon: Mail,
      },
      {
        title: 'Create Mailboxes',
        description: 'Add mailboxes with recovery email option',
        icon: Key,
      },
      {
        title: 'Go Live',
        description: 'Your mailboxes ready in 24-48 hours',
        icon: CheckCircle2,
      },
    ],
    es: [
      {
        title: 'Registro',
        description: 'Cree su cuenta con RUC o documento',
        icon: Lock,
      },
      {
        title: 'Contratar Servidor',
        description: 'Active el plan de correo propio',
        icon: Server,
      },
      {
        title: 'Configurar Dominio',
        description: 'Proporcione su dominio y DNS',
        icon: Mail,
      },
      {
        title: 'Crear Correos',
        description: 'Agregue correos con opción de recuperación',
        icon: Key,
      },
      {
        title: 'Comenzar',
        description: 'Sus correos listos en 24-48 horas',
        icon: CheckCircle2,
      },
    ],
  }

  const titles = {
    pt: 'Fluxo de Configuração de E-mail',
    en: 'Email Setup Flow',
    es: 'Flujo de Configuración de E-mail',
  }

  const flowSteps = steps[lang]

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
      <h3 className="text-2xl font-bold text-emerald-300 mb-8">{titles[lang]}</h3>

      <div className="space-y-4">
        {flowSteps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 p-2 mb-2">
                  <Icon size={20} className="text-white" />
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-slate-700"></div>
                )}
              </div>

              <div className="pt-1 pb-4">
                <h4 className="font-bold text-white text-lg mb-1">
                  {idx + 1}. {step.title}
                </h4>
                <p className="text-slate-400">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-lg border border-amber-300/40 bg-amber-300/10 p-4">
        <p className="text-sm text-amber-100">
          💡 <strong>Dica:</strong> Para cada e-mail, use o e-mail do funcionário como recuperação de senha para acesso rápido em caso de perda.
        </p>
      </div>
    </div>
  )
}
