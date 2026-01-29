import { cn } from '@/lib/utils'
import { Bot, Archive, AlertTriangle, Activity } from 'lucide-react'
import { useRobotStore } from '@/store/robotStore'
import { useLockerStore } from '@/store/lockerStore'
import { Link } from 'react-router-dom'

/**
 * 관리자 대시보드 메인 페이지 (개요)
 * 로봇 상태, 사물함 상태, 사용자 통계 요약
 */
export default function DashboardPage() {
    const { robots } = useRobotStore()
    const { lockers } = useLockerStore()

    // 통계 계산
    const totalRobots = robots.length
    const availableRobots = robots.filter((r) => r.status === 'available').length
    const busyRobots = robots.filter((r) => r.status === 'busy').length
    const unlockedRobots = robots.filter((r) => r.lockStatus === 'unlocked').length

    const totalLockers = lockers.length
    const availableLockers = lockers.filter((l) => l.status === 'available').length
    const occupiedLockers = lockers.filter((l) => l.status === 'occupied').length

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div>
                <h1 className="gradient-title text-2xl font-bold">Dashboard</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Overview of the airport robot management system
                </p>
            </div>

            {/* 로봇 상태 요약 */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-text-primary font-semibold">Robot Status</h2>
                    <Link to="/robots" className="text-accent-cyan text-sm hover:underline">
                        View All →
                    </Link>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <StatCard
                        icon={Bot}
                        iconColor="neon-icon-cyan"
                        value={totalRobots}
                        label="Total Robots"
                    />
                    <StatCard
                        icon={Activity}
                        iconColor="neon-icon-green"
                        value={availableRobots}
                        label="Available"
                        variant="success"
                    />
                    <StatCard
                        icon={Bot}
                        iconColor="neon-icon-orange"
                        value={busyRobots}
                        label="In Mission"
                        variant="warning"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        iconColor="neon-icon-purple"
                        value={unlockedRobots}
                        label="Unlocked"
                        variant={unlockedRobots > 0 ? 'warning' : 'default'}
                    />
                </div>
            </section>

            {/* 사물함 상태 요약 */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-text-primary font-semibold">Locker Status</h2>
                    <Link to="/lockers" className="text-accent-cyan text-sm hover:underline">
                        View All →
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <StatCard
                        icon={Archive}
                        iconColor="neon-icon-cyan"
                        value={totalLockers}
                        label="Total Lockers"
                    />
                    <StatCard
                        icon={Archive}
                        iconColor="neon-icon-green"
                        value={availableLockers}
                        label="Available"
                        variant="success"
                    />
                    <StatCard
                        icon={Archive}
                        iconColor="neon-icon-orange"
                        value={occupiedLockers}
                        label="Occupied"
                        variant="warning"
                    />
                </div>
            </section>

            {/* 최근 활동 */}
            <section>
                <h2 className="text-text-primary font-semibold mb-4">Active Robots</h2>
                <div className="grid grid-cols-3 gap-4">
                    {robots.filter((r) => r.status === 'busy' || r.lockStatus === 'unlocked').map((robot) => (
                        <div
                            key={robot.id}
                            className={cn(
                                "glass-card p-4",
                                robot.lockStatus === 'unlocked' && "neon-border-orange"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Bot className={cn(
                                    "w-10 h-10",
                                    robot.status === 'busy' ? 'neon-icon-cyan' : 'neon-icon-orange'
                                )} />
                                <div>
                                    <p className="text-text-primary font-bold">{robot.name}</p>
                                    <p className="text-text-secondary text-xs">
                                        {robot.status === 'busy' ? 'In Mission' : 'Returning'}
                                        {robot.lockStatus === 'unlocked' && ' • Unlocked'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
                                <span>Battery: {robot.battery}%</span>
                                {robot.assignedLockerId && (
                                    <span>• Locker: {robot.assignedLockerId}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {robots.filter((r) => r.status === 'busy' || r.lockStatus === 'unlocked').length === 0 && (
                        <div className="col-span-3 glass-card p-8 text-center text-text-secondary">
                            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No active robots at the moment</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

/**
 * 통계 카드 컴포넌트
 */
interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>
    iconColor: string
    value: number
    label: string
    variant?: 'default' | 'success' | 'warning' | 'error'
}

function StatCard({ icon: Icon, iconColor, value, label, variant = 'default' }: StatCardProps) {
    const variantStyles = {
        default: '',
        success: 'neon-border-green',
        warning: 'neon-border-orange',
        error: 'border-status-error',
    }

    return (
        <div className={cn("glass-card p-4", variantStyles[variant])}>
            <Icon className={cn("w-8 h-8 mb-3", iconColor)} />
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-text-secondary text-sm">{label}</p>
        </div>
    )
}
