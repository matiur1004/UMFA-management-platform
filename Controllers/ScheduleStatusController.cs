using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;

namespace ClientPortal.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ScheduleStatusController : ControllerBase
    {
        private readonly PortalDBContext _context;

        public ScheduleStatusController(PortalDBContext context)
        {
            _context = context;
        }

        // GET: ScheduleStatus
        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<ScheduleStatus>>> GetScheduleStatus()
        {
          if (_context.ScheduleStatus == null)
          {
              return NotFound();
          }
            return await _context.ScheduleStatus.ToListAsync();
        }

        // GET: ScheduleStatus/5
        [HttpGet("getScheduleStatus/{id}")]
        public async Task<ActionResult<ScheduleStatus>> GetScheduleStatus(int id)
        {
          if (_context.ScheduleStatus == null)
          {
              return NotFound();
          }
            var scheduleStatus = await _context.ScheduleStatus.FindAsync(id);

            if (scheduleStatus == null)
            {
                return NotFound();
            }

            return scheduleStatus;
        }

        //// PUT: ScheduleStatus/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutScheduleStatus(int id, ScheduleStatus scheduleStatus)
        //{
        //    if (id != scheduleStatus.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(scheduleStatus).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ScheduleStatusExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: ScheduleStatus
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<ScheduleStatus>> PostScheduleStatus(ScheduleStatus scheduleStatus)
        //{
        //  if (_context.ScheduleStatus == null)
        //  {
        //      return Problem("Entity set 'PortalDBContext.ScheduleStatus'  is null.");
        //  }
        //    _context.ScheduleStatus.Add(scheduleStatus);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetScheduleStatus", new { id = scheduleStatus.Id }, scheduleStatus);
        //}

        //// DELETE: ScheduleStatus/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteScheduleStatus(int id)
        //{
        //    if (_context.ScheduleStatus == null)
        //    {
        //        return NotFound();
        //    }
        //    var scheduleStatus = await _context.ScheduleStatus.FindAsync(id);
        //    if (scheduleStatus == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.ScheduleStatus.Remove(scheduleStatus);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool ScheduleStatusExists(int id)
        //{
        //    return (_context.ScheduleStatus?.Any(e => e.Id == id)).GetValueOrDefault();
        //}
    }
}
