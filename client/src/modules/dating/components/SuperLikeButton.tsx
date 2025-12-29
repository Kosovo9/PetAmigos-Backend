import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface SuperLikeButtonProps {
    targetUserId: number;
}

const SuperLikeButton: React.FC<SuperLikeButtonProps> = ({ targetUserId }) => {
    const utils = trpc.useUtils();
    const { data: status } = trpc.dating.getSuperLikeStatus.useQuery();
    const [isAnimating, setIsAnimating] = useState(false);

    const superLike = trpc.dating.superLike.useMutation({
        onSuccess: () => {
            toast.success("Golden Star shared! Super Like delivered.");
            utils.dating.getSuperLikeStatus.invalidate();
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 2000);
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const handleClick = () => {
        if (status?.canUse === false) {
            toast.info(`Cooldown active. Try again in ${Math.ceil(status.remaining / 60)} minutes.`);
            return;
        }
        superLike.mutate({ toUserId: targetUserId });
    };

    return (
        <div className="relative inline-block">
            <Button
                onClick={handleClick}
                disabled={status?.canUse === false || superLike.isPending}
                className={`rounded-full p-4 h-auto aspect-square transition-all duration-500 shadow-xl 
                    ${status?.canUse === false ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white hover:scale-110 active:scale-90 hover:rotate-12'}
                    ${isAnimating ? 'animate-bounce' : ''}`}
            >
                <Star className={`w-8 h-8 ${isAnimating ? 'fill-white' : ''}`} />
            </Button>

            {status?.canUse === false && (
                <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    {Math.ceil(status.remaining / 60)}m
                </div>
            )}
        </div>
    );
};

export default SuperLikeButton;
