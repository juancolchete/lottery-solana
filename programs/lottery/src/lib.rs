use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("8kJ7GHGMeVzHzKZGYvVnQJyYMVnAPTYgb4GeXw6ury8s");

#[program]
pub mod lottery {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, key1: u64, key2: u64) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Set>, key1: u64, key2: u64, ticket_number: u64) -> Result<()> {
        if ticket_number > 999999 && ticket_number < 2000000 {
            let lottery_info_len = ctx.accounts.lottery_info.tickets.len();
            let buyer = ctx.accounts.signer.key();
            if lottery_info_len == 0 {
                let buyers = vec![buyer];
                ctx.accounts.lottery_info.tickets.push(Ticket {
                    buyers,
                    number: ticket_number,
                });
            }
            for i in 0..lottery_info_len {
                if lottery_info_len == i {
                    let buyers = vec![buyer];
                    ctx.accounts.lottery_info.tickets.push(Ticket {
                        buyers,
                        number: ticket_number,
                    });
                }
                if ctx.accounts.lottery_info.tickets[i].number == ticket_number {
                    ctx.accounts.lottery_info.tickets[i].buyers.push(buyer);
                    break;
                }
            }
        } else {
            return err!(LotteryError::WrongNumber);
        }
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
    lottery_info: Account<'info, LotteryInfo>,

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
    tickets: Vec<Ticket>,
    full_match: Vec<Pubkey>,
    partial_match: Vec<Pubkey>,
}
#[error_code]
pub enum LotteryError {
    #[msg("Number specified is in a wrong range")]
    WrongNumber,
}
#[account]
pub struct Ticket {
    buyers: Vec<Pubkey>,
    number: u64,
}
