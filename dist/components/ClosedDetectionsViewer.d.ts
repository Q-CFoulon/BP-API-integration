import React from 'react';
import './ClosedDetectionsViewer.css';
export interface ClosedDetection {
    id: string;
    tenantId: string;
    tenantName?: string;
    groupKey: string;
    status: 'RESOLVED';
    alertCount: number;
    riskScore: number;
    alertTypes: string[];
    createdDate: string;
    resolvedDate?: string;
    daysOpen?: number;
    ticketId?: string;
}
interface ClosedDetectionsViewerProps {
    detections: ClosedDetection[];
    isLoading?: boolean;
    error?: string | null;
    onSort?: (column: string, direction: 'ASC' | 'DESC') => void;
}
export declare const ClosedDetectionsViewer: React.FC<ClosedDetectionsViewerProps>;
export default ClosedDetectionsViewer;
//# sourceMappingURL=ClosedDetectionsViewer.d.ts.map