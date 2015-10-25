package com.cloudkarting;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import javax.inject.Named;
import java.util.Date;
import java.util.List;

/**
 * Defines v1 of a race API.
 */
@Api(
    name = "race",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {
            Constants.WEB_CLIENT_ID,
            Constants.ANDROID_CLIENT_ID,
            Constants.IOS_CLIENT_ID,
            Constants.API_EXPLORER_CLIENT_ID
    },
    audiences = {Constants.ANDROID_AUDIENCE}
)
@Entity
public class Race {
    @Id public Long id;
    @Index public String circuit, gp;
    @Index public Date date;
    @Index public Date creationDate;
    public Date updateDate;

    public Race() {
        creationDate = new Date();
        updateDate = creationDate;
    }

    public Race(String circuit, String gp, Date date) {
        this();
        this.circuit = circuit;
        this.gp = gp;
        this.date = date;
    }

    public Race createRace(@Named("circuit") String circuit, @Named("gp") String gp, @Named("date") Date date) {

        Key<Race> key = ObjectifyService.ofy().save().entity(new Race(circuit, gp, date)).now();

        return getRaceById(key.getId());
    }

    @ApiMethod(name="getRaceById", path="getRaceById")
    public Race getRaceById(@Named("id") Long id) {
        return ObjectifyService.ofy().load().type(Race.class).id(id).now();
    }

    public Race updateRace(@Named("id") Long id, @Named("circuit") String name,
                           @Named("gp") String surname, @Named("date") Date date) {

        Race r = getRaceById(id);
        r.circuit = circuit;
        r.gp = gp;
        r.date = date;
        r.updateDate = new Date();

        Key<Race> key = ObjectifyService.ofy().save().entity(r).now();
        return getRaceById(key.getId());
    }

    public List<Race> listRaces() {
        return ObjectifyService.ofy()
                .load()
                .type(Race.class)
                        //.ancestor(Objects)
                        // .order("-creationDate")
                        // .limit(5)
                .list();
    }
}