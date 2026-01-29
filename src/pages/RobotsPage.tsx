import { cn } from '@/lib/utils'
import { useRobotStore } from '@/store/robotStore'
import { Bot, Battery, Lock, Unlock, Play } from 'lucide-react'

/**
 * 로봇 관리 페이지
 * - 모든 로봇 상태 표시
 * - 로봇 선택 → 상세 정보
 * - 로봇 열기/닫기 제어
 */
export default function RobotsPage() {
    const { robots, selectedRobotId, selectRobot, unlockRobot, lockRobot, dispatchRobot } = useRobotStore()
    const selectedRobot = robots.find((r) => r.id === selectedRobotId)

    // 상태별 스타일
    const statusStyles = {
        available: { bg: 'bg-status-active/20', text: 'text-status-active', label: 'Available' },
        busy: { bg: 'bg-accent-cyan/20', text: 'text-accent-cyan', label: 'In Mission' },
        returning: { bg: 'bg-status-warning/20', text: 'text-status-warning', label: 'Returning' },
        maintenance: { bg: 'bg-status-error/20', text: 'text-status-error', label: 'Maintenance' },
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div>
                <h1 className="gradient-title text-2xl font-bold">Robot Management</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Control and monitor all robots
                </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* 로봇 목록 */}
                <div className="col-span-2 space-y-4">
                    <h2 className="text-text-primary font-medium">All Robots</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {robots.map((robot) => {
                            const style = statusStyles[robot.status]
                            return (
                                <button
                                    key={robot.id}
                                    onClick={() => selectRobot(robot.id)}
                                    className={cn(
                                        "glass-card p-4 text-left transition-all",
                                        selectedRobotId === robot.id && "neon-border-cyan"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Bot className={cn("w-8 h-8", style.text)} />
                                        <span className={cn("px-2 py-1 rounded text-xs", style.bg, style.text)}>
                                            {style.label}
                                        </span>
                                    </div>
                                    <p className="text-text-primary font-bold">{robot.name}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                                        <Battery className="w-3 h-3" />
                                        <span>{robot.battery}%</span>
                                        {robot.lockStatus === 'unlocked' ? (
                                            <Unlock className="w-3 h-3 text-status-warning ml-2" />
                                        ) : (
                                            <Lock className="w-3 h-3 text-status-active ml-2" />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 상세 패널 */}
                <div className="glass-card p-6">
                    <h2 className="text-text-primary font-medium mb-4">Robot Details</h2>

                    {selectedRobot ? (
                        <div className="space-y-6">
                            {/* 로봇 정보 */}
                            <div className="text-center">
                                <Bot className="w-16 h-16 mx-auto neon-icon-cyan mb-4" />
                                <h3 className="text-xl font-bold text-text-primary">{selectedRobot.name}</h3>
                                <span className={cn(
                                    "inline-block px-3 py-1 rounded-full text-xs mt-2",
                                    statusStyles[selectedRobot.status].bg,
                                    statusStyles[selectedRobot.status].text
                                )}>
                                    {statusStyles[selectedRobot.status].label}
                                </span>
                            </div>

                            {/* 상세 정보 */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Battery</span>
                                    <span className="text-text-primary">{selectedRobot.battery}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Lock Status</span>
                                    <span className={cn(
                                        selectedRobot.lockStatus === 'locked' ? 'text-status-active' : 'text-status-warning'
                                    )}>
                                        {selectedRobot.lockStatus === 'locked' ? 'Locked' : 'Unlocked'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Position</span>
                                    <span className="text-text-primary">
                                        ({selectedRobot.position.x}, {selectedRobot.position.y})
                                    </span>
                                </div>
                                {selectedRobot.assignedLockerId && (
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Assigned Locker</span>
                                        <span className="text-accent-cyan">{selectedRobot.assignedLockerId}</span>
                                    </div>
                                )}
                            </div>

                            {/* 제어 버튼 */}
                            <div className="space-y-3">
                                {selectedRobot.lockStatus === 'locked' ? (
                                    <button
                                        onClick={() => unlockRobot(selectedRobot.id)}
                                        className="w-full gradient-button flex items-center justify-center gap-2"
                                    >
                                        <Unlock className="w-5 h-5" />
                                        Open Robot
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => lockRobot(selectedRobot.id)}
                                        className="w-full gradient-button flex items-center justify-center gap-2"
                                    >
                                        <Lock className="w-5 h-5" />
                                        Close Robot
                                    </button>
                                )}

                                {selectedRobot.status === 'available' && selectedRobot.lockStatus === 'locked' && (
                                    <button
                                        onClick={() => dispatchRobot(selectedRobot.id)}
                                        className="w-full glass-card py-3 flex items-center justify-center gap-2 text-status-active hover:neon-border-green transition-all"
                                    >
                                        <Play className="w-5 h-5" />
                                        Dispatch Robot
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-text-secondary">
                            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select a robot to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
