'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatTile({
  label,
  value,
  highlight,
  streak,
  delay = 0,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
  streak?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={
          highlight
            ? 'border-primary/60 shadow-sm ring-1 ring-primary/20'
            : streak
              ? 'border-amber-500/50 shadow-sm ring-1 ring-amber-500/20'
              : undefined
        }
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={String(value)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-2xl font-semibold tabular-nums sm:text-3xl"
          >
            {value}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function QueueTile({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
    >
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-xl font-medium tabular-nums">{value}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
