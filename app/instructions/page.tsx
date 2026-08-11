import { InstructionsPageModal } from '@/components/ui/InstructionsPageModal';

export const metadata = {
  title: 'Gameplay Instructions & Guide - Roger\'s Field 3D',
  description: 'Complete gameplay guide for Roger\'s Field 3D farming simulation. Learn how to control Roger, drive the Tractor and Digger, grow crops, raise livestock, and trade produce.',
};

export default function InstructionsPage() {
  return <InstructionsPageModal isStandalonePage={true} />;
}
