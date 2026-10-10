'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Send, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email address'),
  experiencia: z.coerce.number().min(0, 'Minimum 0 years').max(50, 'Maximum 50 years'),
  rol: z.enum(['frontend', 'fullstack', 'lead'] as const),
  aceptaTerminos: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms of the test'
  })
});

type FormSchemaType = z.infer<typeof formSchema>;

export function ValidatedFormExercise() {
  const [datosEnviados, setDatosEnviados] = useState<FormSchemaType | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nombre: '',
      email: '',
      experiencia: 2,
      rol: 'frontend',
      aceptaTerminos: false
    }
  });

  const onSubmit = async (data: FormSchemaType) => {
    // Simulated server submission
    await new Promise(r => setTimeout(r, 600));
    setDatosEnviados(data);
  };

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Exercise 11: Professional Form with Zod and React Hook Form</h3>
        <p className="text-xs text-muted">Evaluates strict real-time validation based on Zod schemas with high-performance uncontrolled inputs.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-medium text-muted block mb-1">Full Name</label>
            <input
              {...register('nombre')}
              placeholder="Alex Morgan"
              className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground ${
                errors.nombre ? 'border-red-500' : ''
              }`}
            />
            {errors.nombre && <p className="text-red-500 text-[11px] mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="font-medium text-muted block mb-1">Email Address</label>
            <input
              {...register('email')}
              placeholder="alex@example.com"
              className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-medium text-muted block mb-1">Years of React Experience</label>
            <input
              type="number"
              {...register('experiencia')}
              className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground ${
                errors.experiencia ? 'border-red-500' : ''
              }`}
            />
            {errors.experiencia && <p className="text-red-500 text-[11px] mt-1">{errors.experiencia.message}</p>}
          </div>

          <div>
            <label className="font-medium text-muted block mb-1">Target Role / Level</label>
            <select
              {...register('rol')}
              className="w-full px-3 py-2 border rounded-xl bg-background text-foreground"
            >
              <option value="frontend">Senior Frontend</option>
              <option value="fullstack">Next.js Fullstack</option>
              <option value="lead">Tech Lead / Architect</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terminos"
            {...register('aceptaTerminos')}
            className="w-4 h-4 rounded text-primary"
          />
          <label htmlFor="terminos" className="text-xs text-muted cursor-pointer">
            I confirm that I understand the 8 levels of the React and Next.js guide
          </label>
        </div>
        {errors.aceptaTerminos && (
          <p className="text-red-500 text-[11px]">{errors.aceptaTerminos.message}</p>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Validating with Zod...' : 'Submit Form'}
          </button>
          <button
            type="button"
            onClick={() => { reset(); setDatosEnviados(null); }}
            className="px-4 py-2 border rounded-xl text-xs hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </form>

      {datosEnviados && (
        <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl text-xs space-y-2 animate-in fade-in-50">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Form validated and successfully processed by Zod!
          </div>
          <pre className="p-3 border rounded-lg bg-background font-mono text-[11px] overflow-x-auto text-foreground">
            {JSON.stringify(datosEnviados, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
