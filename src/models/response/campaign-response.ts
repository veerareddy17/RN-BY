import { TeamResponse } from './team-response';

export class CampaignResponse {
    public id: string;
    public name: string;
    public permission_cost: number;
    public transport_cost: number;
    public salary_cost: number;
    public other_cost: number;
    public total_cost: number;
    public start_date: Date;
    public end_date: Date;
    public address: string;
    public city: string;
    public active: boolean;
    public team: TeamResponse;
}
