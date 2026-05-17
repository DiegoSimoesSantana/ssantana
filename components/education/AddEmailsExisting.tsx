'use client'

import { Plus, Mail } from 'lucide-react'

export function AddEmailsExisting({ lang = 'pt' }: { lang?: 'pt' | 'en' | 'es' }) {
  const content = {
    pt: {
      title: 'Adicionar E-mails ao Servidor Existente',
      subtitle: 'Você já é cliente? Expanda seu servidor',
      bullets: [
        'Adicionar e-mail: R$ 15,00 por alteração',
        'Email de recuperação obrigatório (sugestão: email do funcionário)',
        '5GB de armazenamento por e-mail',
        'Acesso via Webmail, Outlook, Gmail, ou cliente IMAP/POP/SMTP',
        'Configuração realizada em até 2 horas',
      ],
      note: 'Entre em contato com nossa equipe para solicitar novas adições. Envie: nome do e-mail, email de recuperação e senha inicial.',
    },
    en: {
      title: 'Add Mailboxes to Existing Server',
      subtitle: 'Already a customer? Expand your setup',
      bullets: [
        'Add mailbox: BRL 15 per addition',
        'Mandatory recovery email (suggested: employee email)',
        '5GB storage per mailbox',
        'Access via Webmail, Outlook, Gmail, or IMAP/POP/SMTP client',
        'Configuration completed in up to 2 hours',
      ],
      note: 'Contact our team to request new mailboxes. Provide: mailbox name, recovery email, and initial password.',
    },
    es: {
      title: 'Agregue Correos al Servidor Existente',
      subtitle: 'Ya es cliente? Expanda su configuración',
      bullets: [
        'Agregar buzón: R$ 15 por adición',
        'Correo de recuperación obligatorio (sugerencia: correo del empleado)',
        '5GB de almacenamiento por buzón',
        'Acceso mediante Webmail, Outlook, Gmail o cliente IMAP/POP/SMTP',
        'Configuración completada en hasta 2 horas',
      ],
      note: 'Póngase en contacto con nuestro equipo para solicitar nuevos buzones. Proporcione: nombre del buzón, correo de recuperación y contraseña inicial.',
    },
  }

  const t = content[lang]

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
      <h3 className="text-2xl font-bold text-cyan-300 mb-2 flex items-center gap-2">
        <Plus size={24} /> {t.title}
      </h3>
      <p className="text-slate-400 mb-6">{t.subtitle}</p>

      <ul className="space-y-3 mb-8">
        {t.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-slate-100">
            <Mail size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border border-blue-300/40 bg-blue-300/10 p-4">
        <p className="text-sm text-blue-100">
          <strong>Como solicitar:</strong> {t.note}
        </p>
      </div>
    </div>
  )
}
