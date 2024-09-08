use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("8kJ7GHGMeVzHzKZGYvVnQJyYMVnAPTYgb4GeXw6ury8s");

#[program]
pub mod lottery {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, key1: u64, key2: u64) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>,key1: u64, key2: u64, ticket_number: u64) -> Result<()> {
        // if ticket_number > 999999 && ticket_number < 2000000 {
        //     for i in 0..ctx.accounts.lottery_info.tickets.len() as usize {
        //         if ctx.accounts.lottery_info.tickets[i].number == 0 {
        //             ctx.accounts.lottery_info.tickets[i].number = ticket_number;
        //         }
        //         if ctx.accounts.lottery_info.tickets[i].number == ticket_number {
        //             for b in 0..ctx.accounts.lottery_info.tickets[i].buyers.len() as usize {
        //                 if ctx.accounts.lottery_info.tickets[i].buyers[b]
        //                     == ctx.accounts.lottery_info.default
        //                 {
        //                     ctx.accounts.lottery_info.tickets[i].buyers[b] = ctx.accounts.signer.key(); 
        //                     break;
        //                 }
        //             }
        //             break;
        //         }
        //     }
        // }else{
        //     return err!(LotteryError::WrongNumber);
        // }
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(key1: u64, key2: u64)]
pub struct Initialize<'info> {
    #[account(init,
              payer = signer,
              space = size_of::<LotteryInfo>() + 8,
              seeds=[&key1.to_le_bytes().as_ref(),&key2.to_le_bytes().as_ref()],
              bump)]
    lottery_info: Account<'info, Ticket>,

    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(key1: u64,key2: u64)]
pub struct Set<'info> {
    #[account(mut)]
    lottery_info: Account<'info, LotteryInfo>,
    #[account(mut)]
    signer: Signer<'info>,
}

#[account]
pub struct LotteryInfo {
    default: Pubkey,
    tickets: [Ticket; 1000],
    full_match: [Pubkey; 500],
    partial_match: [Pubkey; 500],
}
#[error_code]
pub enum LotteryError {
    #[msg("Number specified is in a wrong range")]
    WrongNumber,
}
#[account]
pub struct Ticket {
    buyers: [Pubkey; 50],
    number: u64,
}
